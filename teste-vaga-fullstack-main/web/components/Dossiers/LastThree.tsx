import { useEffect, FC } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { ConfigProvider, Avatar, Card, List } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";
import ptBRIntl from "antd/lib/locale/pt_BR";
import { ptBR } from "date-fns/locale";
import styles from "./styles.module.css";

// services
import { RootState, useAppDispatch } from "@/core/store";
import { fetchDossierData } from "@/core/dossiers/main";

interface LogItem {
  _id: string;
  slug: string;
  files: Array<string>;
  createdAt: string;
}

const LastThreeDossiers: FC = () => {
  const dispatch = useAppDispatch();
  const dossiersIsLoad = useSelector(
    (state: RootState) => state.dossier.loading
  );
  const dossiers = useSelector((state: RootState) => state.dossier.message);

  useEffect(() => {
    // try get last three
    dispatch(
      fetchDossierData({
        getTheLastThree: false,
      })
    );
  }, []);

  return (
    <ConfigProvider locale={ptBRIntl}>
      <List
        style={{
          width: "100%",
        }}
        grid={{ gutter: [20, 0], column: 3 }}
        loading={dossiersIsLoad}
        dataSource={dossiers}
        renderItem={(item: LogItem) => (
          <List.Item key={item._id}>
            <Card bordered={false}>
              <Card.Meta
                title={
                  <div>
                    <Avatar
                      size="small"
                      icon={<FileDoneOutlined />}
                      style={{ backgroundColor: "#246b44" }}
                    />
                    <Link
                      href={`/forms/slug?id=${item.slug}&fileUid=${
                        item.files[0] || null
                      }`}
                      className={styles.cardTitleSub}
                    >
                      {item.slug
                        ? `Dossiê ${item.slug.slice(0, 3)}...${item.slug.slice(
                            item.slug.length - 3
                          )}`
                        : "....."}
                    </Link>
                  </div>
                }
              />
              <div className={styles.projectItemContent}>
                <span className={styles.datetime} title="31/01/2000">
                  {formatDistanceToNow(item.createdAt, {
                    includeSeconds: true,
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </ConfigProvider>
  );
};

export default LastThreeDossiers;
