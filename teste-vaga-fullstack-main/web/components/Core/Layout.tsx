"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Avatar, ConfigProvider, FloatButton, Space, Statistic } from "antd";
import { PageContainer, ProLayout } from "@ant-design/pro-components";
import { FileDoneOutlined, CloudOutlined } from "@ant-design/icons";
import _defaultProps from "./_defaultProps";
import styles from "./Layout.module.css";
import "./Custom.css";

// services
import { RootState, useAppDispatch } from "@/core/store";
import { socket } from "@/services/socket";
import { fetchBasicStats } from "@/core/forms/imports/stats";
import { postLogData } from "@/core/logs/main";

type CoreLayoutProps = {
  title: string;
  path: string;
  setPathname: Function;
  children: React.ReactNode;
  greetings: boolean;
  extraNav: boolean;
  extraNavItems: Array<ReactNode>;
  showFabUploaded: boolean;
};

const content = (
  <div className={styles.pageHeaderContent}>
    <div className={styles.avatar}>
      <Avatar
        size="large"
        src="https://cdn.discordapp.com/attachments/1195381315017637891/1195429105773068398/ai-desktop.png"
      />
    </div>
    <div className={styles.content}>
      <div className={styles.contentTitle}>
        Olá, Juliana e Lara Financeira Ltda!
      </div>
      <div>Resumo das suas atividades</div>
    </div>
  </div>
);

function convertSecondsToHumanTxt(input: number): string {
  let days = Math.floor(input / (24 * 60 * 60)); // days
  let hours = Math.floor((input % (24 * 60 * 60)) / (60 * 60)); // hours
  let minutes = Math.floor((input % (60 * 60)) / 60); // minutes
  let seconds = Number((input % 60).toFixed(2)); // seconds

  let result = "";

  if (days > 0) {
    result += days + (days === 1 ? " dia, " : " dias, ");
  }

  if (hours > 0) {
    result += hours + (hours === 1 ? " hora, " : " horas, ");
  }

  if (minutes > 0) {
    result += minutes + (minutes === 1 ? " minuto, " : " minutos, ");
  }

  if (seconds > 0) {
    result += seconds + (seconds === 1 ? " segundo" : " segundos");
  }

  return result.trim().replace(/,$/, ""); // fix trailing comma
}

const CoreLayout: React.FC<CoreLayoutProps> = ({
  title,
  greetings,
  path,
  setPathname,
  children,
  extraNav,
  extraNavItems,
  showFabUploaded,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [filesInQueue, setFilesInQueue] = useState<number>(0);
  const basicStats = useSelector(
    (state: RootState) => state.basicStats.message
  );

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNewFileUploaded(value: any) {
      setFilesInQueue(Number(value));
    }

    // try get basic stats
    dispatch(fetchBasicStats());

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("fileQueue", onNewFileUploaded);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("fileQueue", onNewFileUploaded);
    };
  }, []);

  /**
   * Pages log access
   * @param page
   */
  const createLog = (page: string) => {
    switch (page) {
      case "/":
        dispatch(postLogData(`visitou a página "Dashboard"`));
        break;
      case "/dossier/all":
        dispatch(postLogData(`visitou a página "Dossiês registrados"`));
        break;
      case "/dossier/audit":
        dispatch(postLogData(`visitou a página "Dossiês auditoria"`));
        break;
      default:
        break;
    }
  };

  return (
    <div
      id="core-layout"
      style={{
        height: "100vh",
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#246b44",
            colorPrimaryBg: "#246b44",
            colorLink: "#246b44",
          },
          cssVar: true,
        }}
      >
        <ProLayout
          {..._defaultProps}
          title="File import"
          logo="https://cdn.discordapp.com/attachments/1195381315017637891/1195381523533275318/logo-colored-small.webp"
          location={{
            pathname: path,
          }}
          menuFooterRender={(props) => {
            return (
              <a
                style={{
                  lineHeight: "48rpx",
                  display: "flex",
                  height: 48,
                  color: "rgba(255, 255, 255, 0.65)",
                  alignItems: "center",
                }}
                href="https://github.com/smachs/teste-vaga-fullstack"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  alt="pro-logo"
                  src="https://cdn.discordapp.com/attachments/1195381315017637891/1195382553847288010/github.ico"
                  style={{
                    width: 16,
                    height: 16,
                    margin: "0 16px",
                    marginInlineEnd: 10,
                  }}
                />
              </a>
            );
          }}
          onMenuHeaderClick={(e) => router.push("/")}
          menuItemRender={(item, dom) => (
            <a
              onClick={() => {
                // store route path
                setPathname(item.path || "/");
                // create log
                createLog(item.path || "/");
                // redirect to route
                router.push(item.path || "/");
              }}
            >
              {dom}
            </a>
          )}
        >
          <PageContainer
            className={styles.pageHeaderGreetings}
            title={title === "" ? false : title}
            content={greetings === true ? content : false}
            extra={extraNav ? extraNavItems : false}
            affixProps={{
              style: {
                backgroundColor: "#0000",
              },
            }}
            extraContent={
              greetings === true ? (
                <Space size={24}>
                  <Statistic
                    title="Tempo médio"
                    value={convertSecondsToHumanTxt(basicStats.avgTime)}
                  />
                  <Statistic
                    title="Registros salvos"
                    value={basicStats.total}
                    prefix={<FileDoneOutlined />}
                    groupSeparator="."
                  />
                </Space>
              ) : (
                false
              )
            }
          >
            <div
              style={{
                height: "100vh",
                minHeight: 600,
              }}
            >
              {children}
            </div>
          </PageContainer>
        </ProLayout>
        {showFabUploaded ? (
          <FloatButton
            icon={<CloudOutlined />}
            badge={{
              count: filesInQueue,
              overflowCount: 99999,
              color: "#246b44",
            }}
            tooltip={<div>Arq. importados</div>}
          />
        ) : null}
      </ConfigProvider>
    </div>
  );
};

export default CoreLayout;
