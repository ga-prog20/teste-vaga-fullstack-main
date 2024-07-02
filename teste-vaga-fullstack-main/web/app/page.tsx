"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button, Col, Row, Tooltip as TooltipAntd } from "antd";
import { ProCard } from "@ant-design/pro-components";
import {
  FileAddOutlined,
  CloudSyncOutlined,
  CloudUploadOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";

// components
import CoreLayout from "@/components/Core/Layout";
import AppEvents from "@/components/Dashboard/Events";
import LastThreeDossiers from "@/components/Dossiers/LastThree";
import NewDossierModal from "@/components/Dossiers/New";
import ImportCSVModal from "@/components/Forms/Import";

// services
import { RootState, useAppDispatch } from "@/core/store";
import { fetchDossierData } from "@/core/dossiers/main";
import { fetchLogData } from "@/core/logs/main";
import { fetchPolarGraph } from "@/core/forms/imports/graphs/polar";
import { fetchBasicStats } from "@/core/forms/imports/stats";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [pathname, setPathname] = useState<string>("/");
  const [nModalStatus, setNModalStatus] = useState<boolean>(false);
  const [iModalStatus, setIModalStatus] = useState<boolean>(false);
  const polarStats = useSelector(
    (state: RootState) => state.polarGraph.message
  );

  useEffect(() => {
    // try get performance graph
    dispatch(fetchPolarGraph());
  }, []);

  return (
    <CoreLayout
      title="Dashboard"
      greetings={true}
      path={pathname}
      setPathname={setPathname}
      extraNav={false}
      extraNavItems={[]}
      showFabUploaded={true}
    >
      <Row gutter={[8, 0]}>
        <Col span={16}>
          <ProCard direction="column" ghost>
            <ProCard gutter={16} ghost>
              <ProCard
                colSpan={24}
                style={{ marginBottom: 16 }}
                title="Recém-adicionados"
                tooltip="Os 3 últimos dossiês adicionados."
                extra={
                  <TooltipAntd title="Visualizar todos">
                    <Button
                      type="text"
                      icon={<ExportOutlined />}
                      onClick={() => router.push("/dossier/all")}
                    />
                  </TooltipAntd>
                }
                headerBordered
              >
                <Row>
                  <LastThreeDossiers />
                </Row>
              </ProCard>
            </ProCard>
            <ProCard gutter={16} ghost>
              <ProCard
                colSpan={24}
                style={{ height: 390 }}
                bodyStyle={{ paddingTop: 5, paddingBottom: 8 }}
                title="Histórico de eventos"
                headerBordered
              >
                <AppEvents />
              </ProCard>
            </ProCard>
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard direction="column" ghost>
            <ProCard
              colSpan={24}
              bodyStyle={{ padding: 10 }}
              style={{ marginBottom: 16 }}
            >
              <Row gutter={[8, 0]}>
                <Col span={8}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => setNModalStatus(!nModalStatus)}
                    icon={<FileAddOutlined />}
                    ghost
                    block
                  >
                    Adicionar
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => setIModalStatus(!iModalStatus)}
                    icon={<CloudUploadOutlined />}
                    ghost
                    block
                  >
                    Enviar CSV
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      dispatch(
                        fetchDossierData({
                          getTheLastThree: false,
                        })
                      );
                      dispatch(fetchLogData());
                      dispatch(fetchBasicStats());
                      dispatch(fetchPolarGraph());
                    }}
                    icon={<CloudSyncOutlined />}
                    ghost
                    block
                  >
                    Atualizar
                  </Button>
                </Col>
              </Row>
            </ProCard>
            <ProCard
              colSpan={24}
              style={{ height: 550 }}
              title="Desempenho"
              headerBordered
            >
              <PolarArea
                width={500}
                height={500}
                data={{
                  labels: ["Processados", "Avisos", "Registrados"],
                  datasets: [
                    {
                      label: "Documentos",
                      data: [
                        polarStats.total,
                        polarStats.warnings,
                        polarStats.saveds,
                      ],
                      backgroundColor: [
                        "rgba(54, 162, 235, 0.5)",
                        "rgba(255, 206, 86, 0.5)",
                        "rgba(75, 192, 192, 0.5)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </ProCard>
          </ProCard>
        </Col>
      </Row>
      <NewDossierModal
        status={nModalStatus}
        setStatus={setNModalStatus}
        autoReload={false}
        actualRoute={pathname}
      />
      <ImportCSVModal
        status={iModalStatus}
        setStatus={setIModalStatus}
        autoReload={false}
        actualRoute={pathname}
      />
    </CoreLayout>
  );
}
