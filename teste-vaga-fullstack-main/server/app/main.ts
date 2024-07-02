import { httpServer } from "./server";

const port: string | number = process.env.CLIENT_API_PORT || 8080;
httpServer.listen(port, (): void => console.log(`Server is started.`));
