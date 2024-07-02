import React, {
  Dispatch,
  SetStateAction,
  FC,
  useEffect,
  useState,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import { ConfigProvider, Space, Upload, message } from "antd";
import {
  ModalForm,
  ProFormSelect,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import ptBRIntl from "antd/lib/locale/pt_BR";
import type { ProFormInstance } from '@ant-design/pro-components';
import type { UploadProps } from "antd";
import {
  FileTextOutlined,
} from "@ant-design/icons";

// services
import { RootState, useAppDispatch } from "@/core/store";
import { API_URL } from "@/config/api";
import { fetchDossierData } from "@/core/dossiers/main";
import { postStartImport } from "@/core/forms/imports/start";
import { fetchLogData } from "@/core/logs/main";
import { fetchBasicStats } from "@/core/forms/imports/stats";
import { fetchPolarGraph } from "@/core/forms/imports/graphs/polar";

// utils
import delay from "@/utils/delay";
import { deleteFileFromForm } from "@/core/forms/main";
import showToast from "@/core/utils/toast";

interface ChildProps {
  status: boolean;
  setStatus: Dispatch<SetStateAction<boolean>>;
  autoReload: boolean;
  actualRoute: string;
}

const ImportCSVModal: FC<ChildProps> = ({ status, setStatus, autoReload, actualRoute }) => {
  const dispatch = useAppDispatch();
  
  const mFormRef = useRef<ProFormInstance>();
  const mFormData = useSelector((state: RootState) => state.dossier.message);
  const mFormSentSuccess = useSelector(
    (state: RootState) => state.dossier.success
  );
  const [fileUid, setFileUid] = useState<string>("");
  const uploadProps: UploadProps = {
    name: "file",
    action: `${API_URL}/forms/docs/import?fileUid=${fileUid}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onChange({ file, fileList }) {
      if (file.status === "done") {
        showToast({
          status: true,
          text: file.response.message,
          duration: 1.5,
        });
      }
    },
  };

  useEffect(() => {
    // try get all dossiers
    dispatch(
      fetchDossierData({
        getTheLastThree: false,
      })
    );
  }, []);

  /**
   * Delete tmp file uploaded
   */
  function onRemove() {
    if (fileUid !== "") {
      dispatch(
        deleteFileFromForm({
          fileUid,
        })
      );
    }
  }

  /**
   * Form handler
   * @param data
   */
  function onFinish<mForm extends { slug: string }>(data: mForm) {
    dispatch(postStartImport({
      slug: data.slug,
      fileUid: fileUid,
      autoReload: autoReload
    }));
  }

  return (
    <Space>
      <ConfigProvider locale={ptBRIntl}>
        <ModalForm
          formRef={mFormRef}
          title="Importar registros"
          open={status}
          modalProps={{
            onCancel: () => {
              setStatus(!status);
              // delete tmp file uploaded
              onRemove();
            },
          }}
          submitter={{
            searchConfig: {
              submitText: "Iniciar",
            },
          }}
          onFinish={async (values: any) => {
            const { slug } = values;
            // verify is have slug
            if (slug) {
              await delay(2000);
              onFinish({
                slug,
              });
              // checks if it was saved
              if (mFormSentSuccess) {
                await delay(2000);
                setStatus(!status);
                // reset fields
                mFormRef.current?.resetFields();
                // try refresh dashboard(components)
                if (actualRoute === "/") {
                  dispatch(
                    fetchDossierData({
                      getTheLastThree: false,
                    })
                  );
                  dispatch(fetchLogData());
                  dispatch(fetchBasicStats());
                  dispatch(fetchPolarGraph());
                }
              }
            }
          }}
        >
          <ProFormSelect
            name="slug"
            label="Dossiê"
            request={async () =>
              mFormData.map((values) => ({
                label: `Dossiê ${values.slug.slice(0, 3)}...${values.slug.slice(
                  values.slug.length - 3
                )}`,
                value: values.slug,
              })) || []
            }
            placeholder="Selecione o documento"
            rules={[
              {
                required: true,
                message:
                  "Selecione o dossiê que você deseja importar os novos registros.",
              },
            ]}
          />
          <ProFormUploadButton
            {...uploadProps}
            label="Arquivo CSV"
            title="Clique para enviar"
            name="files"
            rules={[
              {
                required: true,
                message: "Selecione um arquivo antes de iniciar a importação!",
              },
            ]}
            fieldProps={{
              maxCount: 1,
              beforeUpload: (file) => {
                const isCSV = file.type === "text/csv";
                if (!isCSV) {
                  message.error("Somente arquivos CSV é permitido.");
                } else {
                  setFileUid(file.uid);
                }
                return isCSV || Upload.LIST_IGNORE;
              },
              onRemove: () => onRemove(),
              iconRender: (file) => {
                switch (file.status) {
                  case 'done':
                    return <FileTextOutlined color="#246b44" />
                }
              },
              progress: {
                strokeColor: "#246b44",
                strokeWidth: 2
              }
            }}
          />
        </ModalForm>
      </ConfigProvider>
    </Space>
  );
};

export default ImportCSVModal;
