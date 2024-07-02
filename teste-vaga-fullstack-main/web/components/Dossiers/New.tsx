import React, { Dispatch, SetStateAction, FC, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { ConfigProvider, Space } from "antd";
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import type { ProFormInstance } from '@ant-design/pro-components';
import { v4 as uuidv4 } from "uuid";
import ptBRIntl from "antd/lib/locale/pt_BR";

// services
import { RootState, useAppDispatch } from "@/core/store";
import { fetchDossierData, postDossierData } from "@/core/dossiers/main";
import { fetchLogData } from "@/core/logs/main";
import { fetchBasicStats } from "@/core/forms/imports/stats";
import { fetchPolarGraph } from "@/core/forms/imports/graphs/polar";

// utils
import delay from "@/utils/delay";

interface ChildProps {
  status: boolean;
  setStatus: Dispatch<SetStateAction<boolean>>;
  autoReload: boolean;
  actualRoute: string;
}

const NewDossierModal: FC<ChildProps> = ({
  status,
  setStatus,
  autoReload,
  actualRoute,
}) => {
  const dispatch = useAppDispatch();

  const [uuid, setUuid] = useState<string>(uuidv4());
  const mFormRef = useRef<ProFormInstance>();
  const mFormSentSuccess = useSelector(
    (state: RootState) => state.dossier.success
  );

  /**
   * Form handler
   * @param data
   */
  function onFinish<mForm extends { slug: string }>(data: mForm) {
    dispatch(
      postDossierData({
        slug: data.slug,
        autoReload: autoReload,
      })
    );
  }

  return (
    <Space>
      <ConfigProvider locale={ptBRIntl}>
        <ModalForm
          title="Adicionar dossiê"
          open={status}
          initialValues={{
            slug: uuid,
          }}
          modalProps={{
            onCancel: () => setStatus(!status),
          }}
          submitter={{
            searchConfig: {
              submitText: "Salvar",
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
                // try close
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
          <ProFormText
            width="md"
            name="slug"
            label="Slug"
            tooltip="Identificador único"
            disabled
          />
        </ModalForm>
      </ConfigProvider>
    </Space>
  );
};

export default NewDossierModal;
