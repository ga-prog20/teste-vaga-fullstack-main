"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ConfigProvider, Col, Row, Tag, Button } from "antd";
import { ProList } from "@ant-design/pro-components";
import {
  FileAddOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import ptBRIntl from "antd/lib/locale/pt_BR";
import { ptBR } from "date-fns/locale";

// components
import CoreLayout from "@/components/Core/Layout";
import NewDossierModal from "@/components/Dossiers/New";

// services
import { RootState, useAppDispatch } from "@/core/store";
import { fetchDossierData, deleteDossierData } from "@/core/dossiers/main";
import delay from "@/utils/delay";

export default function AllDossiersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [pathname, setPathname] = useState("/dossier/all");
  const [nModalStatus, setNModalStatus] = useState<boolean>(false);
  const dossiersIsLoad = useSelector(
    (state: RootState) => state.dossier.loading
  );
  const dossiers = useSelector((state: RootState) => state.dossier.message);

  useEffect(() => {
    // try get all dossiers
    dispatch(
      fetchDossierData({
        getTheLastThree: false,
      })
    );
  }, []);

  return (
    <CoreLayout
      title="Dossiês registrados"
      greetings={false}
      path={pathname}
      setPathname={setPathname}
      extraNav={true}
      extraNavItems={[
        <Button
          key="addDossier"
          type="dashed"
          icon={<FileAddOutlined />}
          onClick={() => setNModalStatus(!nModalStatus)}
        >
          Adicionar
        </Button>,
      ]}
      showFabUploaded={false}
    >
      <Row gutter={[8, 0]}>
        <Col span={24}>
          <ConfigProvider locale={ptBRIntl}>
            <ProList<any>
              rowKey="_id"
              loading={dossiersIsLoad}
              toolBarRender={() => {
                return [];
              }}
              search={false}
              headerTitle={false}
              dataSource={dossiers || []}
              metas={{
                title: {
                  render: (_, record) => [
                    <a
                      key="titleDossier"
                      onClick={() => {
                        router.push(
                          `/forms/slug?id=${record.slug}&fileUid=${
                            record.files[0] || null
                          }`
                        );
                      }}
                    >
                      {`Dossiê ${record.slug.slice(
                        0,
                        3
                      )}...${record.slug.substr(record.slug.length - 3)}`}
                    </a>,
                  ],
                },
                subTitle: {
                  render: (_, record) =>
                    `Arq. enviados: ${record.files.length || 0}`,
                },
                description: {
                  render: (_, record) =>
                    `Criado em ${format(record.createdAt, "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}`,
                },
                avatar: {
                  render: (_, record) => <FileTextOutlined />,
                },
                actions: {
                  render: (text, row) => [
                    <Button
                      key="viewDossier"
                      type="link"
                      onClick={async () => {
                        router.push(
                          `/forms/slug?id=${row.slug}&fileUid=${
                            row.files[0] || null
                          }`
                        );
                      }}
                    >
                      Visualizar
                    </Button>,
                    <Button
                      key="removeDossier"
                      type="link"
                      onClick={async () => {
                        dispatch(
                          deleteDossierData({
                            id: row._id,
                            slug: row.slug,
                          })
                        );
                        // wait a while
                        await delay(2000);
                        // refresh page
                        window.location.reload();
                      }}
                    >
                      Remover
                    </Button>,
                  ],
                },
              }}
            />
          </ConfigProvider>
        </Col>
      </Row>
      <NewDossierModal
        status={nModalStatus}
        setStatus={setNModalStatus}
        autoReload={true}
        actualRoute={pathname}
      />
    </CoreLayout>
  );
}
