import { useEffect, FC } from "react";
import { useSelector } from "react-redux";
import { Avatar, Empty, List, Spin, Typography } from "antd";
import {
  QuestionCircleOutlined,
  GlobalOutlined,
  ChromeOutlined,
} from "@ant-design/icons";
import VirtualList from "rc-virtual-list";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// services
import { RootState, useAppDispatch } from "@/core/store";
import { fetchLogData } from "@/core/logs/main";

// utils
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";

interface LogItem {
  _id: string;
  browser: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

const ContainerHeight = 300;
const AppEvents: FC = () => {
  const dispatch = useAppDispatch();
  const logsIsLoad = useSelector((state: RootState) => state.log.loading);
  const logs = useSelector((state: RootState) => state.log.message);

  useEffect(() => {
    // try get all logs
    dispatch(fetchLogData());
  }, []);

  // get browser icon
  const browserIcon = (value: string) => {
    switch (value) {
      case "unknown":
        return <QuestionCircleOutlined />;
      case "Chrome":
        return <ChromeOutlined />;
      default:
        return <GlobalOutlined />;
    }
  };

  return (
    <List>
      {logsIsLoad ? (
        <Spin style={{ marginTop: 35 }} />
      ) : (
        <>
          {logs.length > 0 ? (
            <VirtualList
              data={logs}
              height={ContainerHeight}
              itemHeight={47}
              itemKey="_id"
            >
              {(item: LogItem) => (
                <List.Item key={item._id}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={browserIcon(item.browser)}
                        style={{ backgroundColor: "#246b44" }}
                      />
                    }
                    title={
                      <Typography.Text>
                        {capitalizeFirstLetter(item.browser)}
                      </Typography.Text>
                    }
                    description={capitalizeFirstLetter(item.message)}
                  />
                  <div>
                    {formatDistanceToNow(item.createdAt, {
                      includeSeconds: true,
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </div>
                </List.Item>
              )}
            </VirtualList>
          ) : (
            <Empty
              style={{ marginTop: 50 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Não há dados"
            />
          )}
        </>
      )}
    </List>
  );
};

export default AppEvents;
