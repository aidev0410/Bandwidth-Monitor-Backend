import { checkStatus } from "../services/bandwidth.services";
import { pingIp, sendRocketChatMessage } from "../utils/helper";
import { getUserByIp } from "../services/user.services";
import Logger from "../utils/logger";

const checkClientStatus = async () => {
  Logger.info("Start Checking Client Status");
  const statuses = await checkStatus();
  await Promise.all(
    statuses.map(async (s) => {
      const isClientAvailable = await pingIp(s.ip);
      if (isClientAvailable && !s.status) {
        const user = await getUserByIp(s.ip);
        if (user) {
          await sendRocketChatMessage(
            user.name,
            "Your bandwidth monitor is not working."
          );
          Logger.info(`${user.name}, Your bandwidth monitor is not working.`);
        }
      }
    })
  );
  Logger.info("Stop Checking Client Status");
};

export default checkClientStatus;
