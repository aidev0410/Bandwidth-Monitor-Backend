import Bandwidth from "../entities/Bandwidth";
import AppDataSource from "../database/data-source";
import { BandwidthInfo } from "../utils/type";
import User from "../entities/User";
import { bytesToGB, sendRocketChatMessage } from "../utils/helper";
import { LIMITS, UNIT } from "../utils/constants";

const bandWidthRepository = AppDataSource.getRepository(Bandwidth);

export const createBandwidth = async (
  date: Date,
  ip: string,
  runtime: number,
  usage: number,
  user: User
) => {
  const newBandwidth = bandWidthRepository.create({
    date,
    ip,
    runtime,
    usage,
    user,
  });
  return await bandWidthRepository.manager.transaction(async (manager) => {
    return await manager.save(newBandwidth);
  });
};

export const addBandwidth = async (
  ip: string,
  infos: Record<string, BandwidthInfo>,
  user: User
) => {
  await Promise.all(
    Object.keys(infos).map(async (date) => {
      const prevUsage = await getBandwidthUsage(ip, date);
      await createBandwidth(
        new Date(date),
        ip,
        infos[date].runtime,
        Math.round(infos[date].usage),
        user
      );
      const curUsage = prevUsage + Math.round(infos[date].usage);

      await sendUsageAlert(user.name, prevUsage, curUsage);
      await sendLimitAlert(user.name, user.limit, prevUsage, curUsage);
    })
  );
};

export const getBandwidthMonthlyData = async (year: number, month: number) => {
  const dailyData = await bandWidthRepository
    .createQueryBuilder("bandwidth")
    .select("bandwidth.date", "date")
    .addSelect("bandwidth.ip", "ip")
    .addSelect("SUM(bandwidth.runtime)", "runtime")
    .addSelect("SUM(bandwidth.usage)", "usage")
    .where("EXTRACT(year from bandwidth.date) = :year", { year })
    .andWhere("EXTRACT(month from bandwidth.date) = :month", { month })
    .groupBy("bandwidth.date")
    .addGroupBy("bandwidth.ip")
    .orderBy("bandwidth.date")
    .addOrderBy("bandwidth.ip")
    .getRawMany();

  const totalIpData = await bandWidthRepository
    .createQueryBuilder("bandwidth")
    .select("bandwidth.ip", "ip")
    .addSelect("SUM(bandwidth.runtime)", "runtime")
    .addSelect("SUM(bandwidth.usage)", "usage")
    .where("EXTRACT(year from bandwidth.date) = :year", { year })
    .andWhere("EXTRACT(month from bandwidth.date) = :month", { month })
    .groupBy("bandwidth.ip")
    .orderBy("bandwidth.ip")
    .getRawMany();

  const totalDateData = await bandWidthRepository
    .createQueryBuilder("bandwidth")
    .select("bandwidth.date", "date")
    .addSelect("SUM(bandwidth.runtime)", "runtime")
    .addSelect("SUM(bandwidth.usage)", "usage")
    .where("EXTRACT(year from bandwidth.date) = :year", { year })
    .andWhere("EXTRACT(month from bandwidth.date) = :month", { month })
    .groupBy("bandwidth.date")
    .orderBy("bandwidth.date")
    .getRawMany();

  let total = await bandWidthRepository
    .createQueryBuilder("bandwidth")
    .select("SUM(bandwidth.runtime)", "runtime")
    .addSelect("SUM(bandwidth.usage)", "usage")
    .where("EXTRACT(year from bandwidth.date) = :year", { year })
    .andWhere("EXTRACT(month from bandwidth.date) = :month", { month })
    .getRawOne();

  const data: Record<string, Record<string, BandwidthInfo>> = {};
  dailyData.forEach((info) => {
    if (!data[info.ip]) {
      data[info.ip] = {};
    }
    data[info.ip][info.date.toISOString().split("T")[0]] = {
      runtime: info.runtime,
      usage: info.usage,
    };
  });
  let totalIp: Record<string, BandwidthInfo> = {};
  totalIpData.forEach((info) => {
    totalIp[info.ip] = {
      runtime: info.runtime,
      usage: info.usage,
    };
  });
  let totalDate: Record<string, BandwidthInfo> = {};
  totalDateData.forEach((info) => {
    totalDate[info.date.toISOString().split("T")[0]] = {
      runtime: info.runtime,
      usage: info.usage,
    };
  });

  return { data, totalIp, totalDate, total };
};

export const checkStatus = async () => {
  const data = await bandWidthRepository
    .createQueryBuilder("bandwidth")
    .select("bandwidth.ip", "ip")
    .addSelect("MAX(bandwidth.createdAt)", "createdAt")
    .groupBy("ip")
    .orderBy("ip")
    .getRawMany();
  const current = new Date();
  return data.map((info) => ({
    ip: info.ip,
    status:
      Math.round((current.getTime() - info.createdAt.getTime()) / 1000) <= 60,
  }));
};

export const getBandwidthUsage = async (ip: string, date: string) => {
  const data = await bandWidthRepository
    .createQueryBuilder("bandwidth")
    .select("SUM(bandwidth.usage)", "usage")
    .where("bandwidth.ip = :ip", { ip })
    .andWhere("bandwidth.date = :date", { date })
    .getRawOne();
  return data ? Number(data["usage"]) : 0;
};

export const sendUsageAlert = async (
  name: string,
  prevUsage: number,
  curUsage: number
) => {
  if (bytesToGB(prevUsage) < bytesToGB(curUsage)) {
    await sendRocketChatMessage(
      name,
      `You used ${bytesToGB(
        curUsage
      )}GB. Please take care about your bandwidth.`
    );
  }
};

export const sendLimitAlert = async (
  name: string,
  limit: number,
  prevUsage: number,
  curUsage: number
) => {
  await Promise.all(
    LIMITS.map(async (l) => {
      const bytes = l * UNIT.ONE_MB;
      if (limit - prevUsage > bytes && limit - curUsage <= bytes) {
        await sendRocketChatMessage(
          name,
          `Only ${l}MB is remaining on your side.`
        );
      }
    })
  );
};
