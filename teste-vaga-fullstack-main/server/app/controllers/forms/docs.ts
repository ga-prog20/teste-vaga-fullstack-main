import { Request, Response } from "express";
import * as fs from "fs";
import { parse } from "csv-parse";
import { Transform, Writable } from "stream";
import * as flatbuffers from "flatbuffers";
import _ from "lodash";
import { differenceInSeconds } from "date-fns";

// types
import { iFormDoc } from "../../interfaces/doc";

// models
import { File } from "../../models/form/file";
import { Files } from "../../models/form/files";
import { Log, LogInput } from "../../models/log";

// utils
import deleteFileIfExists from "../../utils/checkAndRemoveFile";
import { validateDoc } from "../../utils/validation/fields/anothers";
import { validateInstallment } from "../../utils/validation/fields/installment";
import { parseDateString } from "../../utils/validation/fields/date";
import { genImportLog } from "../../utils/validation/fields/log";
import { Dossier } from "../../models/dossier";

interface AllFormDocsParams {
  fileUid: string;
  page: number;
  limit: number;
}
const allDocsOfForm = async (
  req: Request<{}, {}, {}, AllFormDocsParams>,
  res: Response
) => {
  try {
    const { fileUid, page = 1, limit = 10 } = req.query;

    if (
      fileUid === null ||
      fileUid === undefined ||
      fileUid === "null" ||
      fileUid === "" ||
      typeof fileUid !== "string"
    ) {
      return res.status(201).json({
        success: true,
        message: [],
      });
    }
    if (isNaN(page) || isNaN(limit)) {
      return res.status(422).json({
        success: false,
        message: "Page e limit devem ser números!",
      });
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const records = <any>[];
    // deserialize bin file
    const buffer = fs.readFileSync(`uploads/${fileUid}.bin`);
    const bytes = new Uint8Array(buffer).buffer;
    const uint8Array = new Uint8Array(bytes);
    const files = Files.getRootAsFiles(new flatbuffers.ByteBuffer(uint8Array));

    for (let i = 0; i < files.recordsLength(); i++) {
      const data = files.records(i)!;
      // tmp doc
      const currentDoc = {
        cdCarteira: data.cdCarteira(),
        cdClient: data.cdClient(),
        cdProduto: data.cdProduto(),
        dsCarteira: data.dsCarteira(),
        dsProduto: data.dsProduto(),
        dtContrato: data.dtContrato(),
        dtVctPre: data.dtVctPre(),
        idSituac: data.idSituac(),
        idSitVen: data.idSitVen(),
        nmClient: data.nmClient(),
        nrAgencia: data.nrAgencia(),
        nrContrato: data.nrContrato(),
        nrInst: data.nrInst(),
        nrPresta: data.nrPresta(),
        nrProposta: data.nrProposta(),
        nrSeqPre: data.nrSeqPre(),
        qtPrestacoes: data.qtPrestacoes(),
        tpPresta: data.tpPresta(),
        vlAtual: data.vlAtual(),
        vlDescon: data.vlDescon(),
        vlIof: data.vlIof(),
        vlMora: data.vlMora(),
        vlMulta: data.vlMulta(),
        vlOutAcr: data.vlOutAcr(),
        vlPresta: data.vlPresta(),
        vlTotal: data.vlTotal(),
        nrCpfCnpj: data.nrCpfCnpj(),
        sitVal: data.sitVal(),
      };
      // try push
      records.push(currentDoc);
    }

    // try paginate
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;
    const totalOfPages = Math.ceil(records.length / limitNum);

    return res.status(201).json({
      success: true,
      message: records.slice(start, end) || [],
      totalOfPages,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const uploadTmpFileForForm = async (req: Request, res: Response) => {
  try {
    const { fileUid } = req.query;

    if (
      fileUid === null ||
      fileUid === undefined ||
      fileUid === "" ||
      typeof fileUid !== "string"
    ) {
      // check if file was uploaded
      deleteFileIfExists(`uploads/${fileUid}.csv`);

      return res.status(422).json({
        success: false,
        message: "FileUid é obrigatório",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Arquivo enviado com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const deleteTmpFileOfForm = async (req: Request, res: Response) => {
  try {
    const { fileUid } = req.query;

    if (
      fileUid === null ||
      fileUid === undefined ||
      fileUid === "" ||
      typeof fileUid !== "string"
    ) {
      return res.status(422).json({
        success: false,
        message: "FileUid é obrigatório",
      });
    }

    // check and delete
    deleteFileIfExists(`uploads/${fileUid}.csv`);
    deleteFileIfExists(`uploads/${fileUid}.bin`);

    return res.status(201).json({
      success: true,
      message: "Arquivo removido com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

/**
 * Try convert CSV to JSON and serialize in bin file
 * @param slug
 * @param fileUid
 * @param browser
 * @param io
 */
function startJob(slug: string, fileUid: string, browser: string, io: any) {
  const records = <any>[];
  let binObjs = <any>[];
  let fileCounter = 1;
  let savedsCounter = 0;
  let warningsCounter = 0;
  let totalCounter = 0;
  let startAt = new Date();

  console.log("Job started: ", startAt);
  // create a new log
  const logData: LogInput = {
    browser,
    message: `iniciou uma nova importacao ao dossiê: ${slug}`,
  };
  Log.create(logData);

  const readableStream = fs.createReadStream(`uploads/${fileUid}.csv`);
  const transformStreamToObject = parse({
    delimiter: ";", // ; fix values with commas
    columns: true,
  });
  transformStreamToObject.on("close", () => {
    const { records } = transformStreamToObject.info;
    totalCounter = records;
  });

  const transformStreamToString = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      callback(null, JSON.stringify(chunk));
    },
  });

  const writableStream = new Writable({
    write(chunk, encoding, callback) {
      const string = chunk.toString();
      const data = JSON.parse(string);
      const currentDoc: iFormDoc = {
        cdCarteira: Number(data.cdCarteira),
        cdClient: Number(data.cdClient),
        cdProduto: Number(data.cdProduto),
        dsCarteira: data.dsCarteira,
        dsProduto: data.dsProduto,
        dtContrato: parseDateString(data.dtContrato),
        dtVctPre: parseDateString(data.dtVctPre),
        idSituac: data.idSituac,
        idSitVen: data.idSitVen,
        nmClient: data.nmClient,
        nrAgencia: Number(data.nrAgencia),
        nrContrato: Number(data.nrContrato),
        nrInst: Number(data.nrInst),
        nrPresta: Number(data.nrPresta),
        nrProposta: Number(data.nrProposta),
        nrSeqPre: Number(data.nrSeqPre),
        qtPrestacoes: Number(data.qtPrestacoes),
        tpPresta: data.tpPresta,
        vlAtual: `R$ ${Number(data.vlAtual).toFixed(2)}`,
        vlDescon: `R$ ${Number(data.vlDescon).toFixed(2)}`,
        vlIof: `R$ ${Number(data.vlIof).toFixed(2)}`,
        vlMora: `R$ ${Number(data.vlMora).toFixed(2)}`,
        vlMulta: `R$ ${Number(data.vlMulta).toFixed(2)}`,
        vlOutAcr: `R$ ${Number(data.vlOutAcr).toFixed(2)}`,
        vlPresta: `R$ ${Number(data.vlPresta).toFixed(2)}`,
        vlTotal: `R$ ${Number(data.vlTotal).toFixed(2)}`,
        nrCpfCnpj: validateDoc(data.nrCpfCnpj),
        sitVal: validateInstallment(
          Number(data.qtPrestacoes),
          Number(data.vlTotal),
          Number(data.vlPresta)
        ),
      };
      // check is have warning
      let containsNull = _.some(currentDoc, _.isNull);
      if (containsNull) {
        warningsCounter++;
      } else {
        savedsCounter++;
      }
      records.push(currentDoc);
      // push queue status
      io.emit("fileQueue", fileCounter);
      fileCounter++;
      callback();
    },
  });

  readableStream
    .pipe(transformStreamToObject)
    .pipe(transformStreamToString)
    .pipe(writableStream)
    .on("close", () => {
      let builder = new flatbuffers.Builder(1024);
      let endAt = new Date();
      console.log("Job finished: ", endAt);

      for (let i = 0; i < records.length; i++) {
        let nrInst = records[i].nrInst;
        let nrAgencia = records[i].nrAgencia;
        let cdClient = records[i].cdClient;
        let nmClient = builder.createString(records[i].nmClient);
        let nrCpfCnpj = builder.createString(records[i].nrCpfCnpj);
        let nrContrato = records[i].nrContrato;
        let dtContrato = builder.createString(records[i].dtContrato);
        let qtPrestacoes = records[i].qtPrestacoes;
        let vlTotal = builder.createString(records[i].vlTotal);
        let cdProduto = records[i].cdProduto;
        let dsProduto = builder.createString(records[i].dsProduto);
        let cdCarteira = records[i].cdCarteira;
        let dsCarteira = builder.createString(records[i].dsCarteira);
        let nrProposta = records[i].nrProposta;
        let nrPresta = records[i].nrPresta;
        let tpPresta = builder.createString(records[i].tpPresta);
        let nrSeqPre = records[i].nrSeqPre;
        let dtVctPre = builder.createString(records[i].dtVctPre);
        let vlPresta = builder.createString(records[i].vlPresta);
        let vlMora = builder.createString(records[i].vlMora);
        let vlMulta = builder.createString(records[i].vlMulta);
        let vlOutAcr = builder.createString(records[i].vlOutAcr);
        let vlIof = builder.createString(records[i].vlIof);
        let vlDescon = builder.createString(records[i].vlDescon);
        let vlAtual = builder.createString(records[i].vlAtual);
        let idSituac = builder.createString(records[i].idSituac);
        let idSitVen = builder.createString(records[i].idSitVen);
        let sitVal = records[i].sitVal;

        let record = File.createFile(
          builder,
          nrInst,
          nrAgencia,
          cdClient,
          nmClient,
          nrCpfCnpj,
          nrContrato,
          dtContrato,
          qtPrestacoes,
          vlTotal,
          cdProduto,
          dsProduto,
          cdCarteira,
          dsCarteira,
          nrProposta,
          nrPresta,
          tpPresta,
          nrSeqPre,
          dtVctPre,
          vlPresta,
          vlMora,
          vlMulta,
          vlOutAcr,
          vlIof,
          vlDescon,
          vlAtual,
          idSituac,
          idSitVen,
          sitVal
        );
        binObjs.push(record);
      }

      let recordsVector = Files.createRecordsVector(builder, binObjs);
      Files.startFiles(builder);
      Files.addRecords(builder, recordsVector);

      let filesObject = Files.endFiles(builder);
      builder.finish(filesObject);
      let buf = builder.asUint8Array();

      // write bin
      fs.writeFileSync(`uploads/${fileUid}.bin`, buf);
      // delete csv
      deleteFileIfExists(`uploads/${fileUid}.csv`);

      // attach file in dossier
      Dossier.findOneAndUpdate(
        { slug: slug },
        { $set: { "files.0": fileUid } },
        { new: true, useFindAndModify: false } // options
      )
        .then((doc) => {
          console.log(`New file ${fileUid} attached in dossier: ${slug}`);
        })
        .catch((err) => {
          // delete csv and bin
          deleteFileIfExists(`uploads/${fileUid}.csv`);
          deleteFileIfExists(`uploads/${fileUid}.bin`);
          // cancel job
          return;
        });
      // create a new log
      const logData: LogInput = {
        browser,
        message: `importação ao dossiê ${slug} concluída com sucesso.`,
      };
      let elapsedTime = differenceInSeconds(endAt, startAt);
      Log.create(logData);
      genImportLog(
        slug,
        "finished",
        savedsCounter,
        warningsCounter,
        totalCounter,
        elapsedTime === 0 ? 5 : elapsedTime
      );
    });
}

interface StartImportParams {
  slug: string;
  fileUid: string;
}
const startImportInForm = async (
  req: Request<{}, {}, {}, StartImportParams>,
  res: Response
) => {
  try {
    const { slug, fileUid } = req.query;
    const browser = req.useragent?.browser || "Unknown";

    if (
      fileUid === null ||
      fileUid === undefined ||
      fileUid === "" ||
      typeof fileUid !== "string"
    ) {
      return res.status(422).json({
        success: false,
        message: "FileUid é obrigatório",
      });
    }

    // try start job
    startJob(slug, fileUid, browser, req.app.settings.io);

    res.status(201).json({
      success: true,
      message: "Arquivo processado com sucesso, aguarde a conclusão!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export {
  allDocsOfForm,
  uploadTmpFileForForm,
  deleteTmpFileOfForm,
  startImportInForm,
};
