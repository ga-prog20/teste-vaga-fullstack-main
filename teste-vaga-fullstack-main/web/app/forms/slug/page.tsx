"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { ConfigProvider, Col, Row, Button, Table } from "antd";
import { ReloadOutlined, CloudUploadOutlined } from "@ant-design/icons";
import type { TablePaginationConfig } from "antd";
import ptBRIntl from "antd/lib/locale/pt_BR";

// components
import CoreLayout from "@/components/Core/Layout";
import ImportCSVModal from "@/components/Forms/Import";

// services
import { RootState, useAppDispatch } from "@/core/store";
import { fetchFormData } from "@/core/forms/main";

// utils
import {
  formatCNPJ,
  formatCPF,
  isValidCNPJ,
  isValidCPF,
} from "@brazilian-utils/brazilian-utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ViewFormBySlugPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const slug = searchParams.get("id");
  const fileUid = searchParams.get("fileUid");
  const [pathname, setPathname] = useState("/forms/slug");
  const [iModalStatus, setIModalStatus] = useState<boolean>(false);
  const formIsLoad = useSelector((state: RootState) => state.form.loading);
  const formData = useSelector((state: RootState) => state.form.message);
  const formTotalOfPages = useSelector(
    (state: RootState) => state.form.totalOfPages
  );

  const columns = [
    {
      title: "nrInst",
      dataIndex: "nrInst",
      key: "nrInst",
      ellipsis: true,
      sorter: (a: any, b: any) => a.nrInst - b.nrInst,
    },
    {
      title: "nrAgencia",
      dataIndex: "nrAgencia",
      key: "nrAgencia",
      ellipsis: true,
      sorter: (a: any, b: any) => a.nrAgencia - b.nrAgencia,
    },
    {
      title: "cdClient",
      dataIndex: "cdClient",
      key: "cdClient",
      ellipsis: true,
      sorter: (a: any, b: any) => a.cdClient.length - b.cdClient.length,
    },
    {
      title: "nmClient",
      dataIndex: "nmClient",
      key: "nmClient",
      ellipsis: true,
      sorter: (a: any, b: any) => a.nmClient.length - b.nmClient.length,
    },
    {
      title: "nrCpfCnpj",
      dataIndex: "nrCpfCnpj",
      key: "nrCpfCnpj",
      ellipsis: true,
      sorter: (a: any, b: any) => a.nrCpfCnpj.length - b.nrCpfCnpj.length,
      render: (text: string) => {
        if (isValidCPF(text)) {
          return formatCPF(text);
        }
        if (isValidCNPJ(text)) {
          return formatCNPJ(text);
        }
      },
    },
    {
      title: "nrContrato",
      dataIndex: "nrContrato",
      key: "nrContrato",
      ellipsis: true,
      sorter: (a: any, b: any) => a.nrContrato - b.nrContrato,
    },
    {
      title: "dtContrato",
      dataIndex: "dtContrato",
      key: "dtContrato",
      ellipsis: true,
      sorter: (a: any, b: any) => a.dtContrato.length - b.dtContrato.length,
      render: (text: any) => {
        if (!isNaN(Date.parse(text))) {
          const date = new Date(text);
          return format(date, "dd/MM/yyyy HH:mm", {
            locale: ptBR,
          });
        }
      },
    },
    {
      title: "qtPrestacoes",
      dataIndex: "qtPrestacoes",
      key: "qtPrestacoes",
      ellipsis: true,
      sorter: (a: any, b: any) => a.qtPrestacoes - b.qtPrestacoes,
    },
    {
      title: "vlTotal",
      dataIndex: "vlTotal",
      key: "vlTotal",
      ellipsis: true,
    },
    {
      title: "cdProduto",
      dataIndex: "cdProduto",
      key: "cdProduto",
      ellipsis: true,
      sorter: (a: any, b: any) => a.cdProduto - b.cdProduto,
    },
    {
      title: "dsProduto",
      dataIndex: "dsProduto",
      key: "dsProduto",
      ellipsis: true,
      sorter: (a: any, b: any) => a.dsProduto.length - b.dsProduto.length,
    },
    {
      title: "cdCarteira",
      dataIndex: "cdCarteira",
      key: "cdCarteira",
      ellipsis: true,
      sorter: (a: any, b: any) => a.cdCarteira - b.cdCarteira,
    },
    {
      title: "dsCarteira",
      dataIndex: "dsCarteira",
      key: "dsCarteira",
      ellipsis: true,
    },
    {
      title: "nrProposta",
      dataIndex: "nrProposta",
      key: "nrProposta",
      ellipsis: true,
      sorter: (a: any, b: any) => a.nrProposta - b.nrProposta,
    },
    {
      title: "nrPresta",
      dataIndex: "nrPresta",
      key: "nrPresta",
      ellipsis: true,
      sorter: (a: any, b: any) => a.nrPresta - b.nrPresta,
    },
    {
      title: "tpPresta",
      dataIndex: "tpPresta",
      key: "tpPresta",
      ellipsis: true,
    },
    {
      title: "nrSeqPre",
      dataIndex: "nrSeqPre",
      key: "nrSeqPre",
      ellipsis: true,
      sorter: (a: any, b: any) => a.nrSeqPre - b.nrSeqPre,
    },
    {
      title: "dtVctPre",
      dataIndex: "dtVctPre",
      key: "dtVctPre",
      ellipsis: true,
      sorter: (a: any, b: any) => a.dtVctPre.length - b.dtVctPre.length,
      render: (text: any) => {
        if (!isNaN(Date.parse(text))) {
          const date = new Date(text);
          return format(date, "dd/MM/yyyy HH:mm", {
            locale: ptBR,
          });
        }
      },
    },
    {
      title: "vlPresta",
      dataIndex: "vlPresta",
      key: "vlPresta",
      ellipsis: true,
    },
    {
      title: "vlMora",
      dataIndex: "vlMora",
      key: "vlMora",
      ellipsis: true,
    },
    {
      title: "vlMulta",
      dataIndex: "vlMulta",
      key: "vlMulta",
      ellipsis: true,
    },
    {
      title: "vlOutAcr",
      dataIndex: "vlOutAcr",
      key: "vlOutAcr",
      ellipsis: true,
    },
    {
      title: "vlIof",
      dataIndex: "vlIof",
      key: "vlIof",
      ellipsis: true,
    },
    {
      title: "vlDescon",
      dataIndex: "vlDescon",
      key: "vlDescon",
      ellipsis: true,
    },
    {
      title: "vlAtual",
      dataIndex: "vlAtual",
      key: "vlAtual",
      ellipsis: true,
    },
    {
      title: "idSituac",
      dataIndex: "idSituac",
      key: "idSituac",
      ellipsis: true,
    },
    {
      title: "idSitVen",
      dataIndex: "idSitVen",
      key: "idSitVen",
      ellipsis: true,
    },
    {
      title: "sitVal",
      dataIndex: "sitVal",
      key: "sitVal",
      ellipsis: true,
      render: (text: any) => {
        if (text) {
          return "Sim";
        } else {
          return "Não";
        }
      },
    },
  ];

  useEffect(() => {
    // try get docs
    dispatch(
      fetchFormData({
        slug: slug,
        fileUid: fileUid,
        pageSize: 10,
        page: 1,
      })
    );
  }, []);

  const handlePagination = (pagination: TablePaginationConfig): void => {
    // try go to next page
    dispatch(
      fetchFormData({
        slug: slug,
        fileUid: fileUid,
        pageSize: pagination.pageSize || 10,
        page: pagination.current || 1,
      })
    );
  };

  return (
    <CoreLayout
      title="Registros do formulário"
      greetings={false}
      path={pathname}
      setPathname={setPathname}
      extraNav={true}
      extraNavItems={[
        <Button
          key="uploadCSV"
          icon={<ReloadOutlined />}
          onClick={async () =>
            dispatch(
              fetchFormData({
                slug: slug,
                fileUid: fileUid,
                pageSize: 10,
                page: 1,
              })
            )
          }
        >
          Atualizar
        </Button>,
        <Button
          key="uploadCSV"
          type="primary"
          icon={<CloudUploadOutlined />}
          onClick={async () => setIModalStatus(!iModalStatus)}
        >
          Enviar CSV
        </Button>,
      ]}
      showFabUploaded={true}
    >
      <Row gutter={[8, 0]}>
        <Col span={24}>
          <ConfigProvider locale={ptBRIntl}>
            <Table
              columns={columns}
              dataSource={formData}
              loading={formIsLoad}
              scroll={{
                x: true,
              }}
              pagination={{
                pageSize: 10,
                total: formTotalOfPages,
                showSizeChanger: false,
              }}
              onChange={handlePagination}
            />
          </ConfigProvider>
        </Col>
      </Row>
      <ImportCSVModal
        status={iModalStatus}
        setStatus={setIModalStatus}
        autoReload={false}
        actualRoute={pathname}
      />
    </CoreLayout>
  );
}
