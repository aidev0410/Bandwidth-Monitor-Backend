import Bandwidth from "../entities/Bandwidth";
import AppDataSource from "../database/data-source";
import { BandwidthInfo } from "../utils/type";
import User from "../entities/User";

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
      await createBandwidth(
        new Date(date),
        ip,
        infos[date].runtime,
        Math.round(infos[date].usage),
        user
      );
    })
  );
};

export const getBandwidthMonthlyData = async (year: number, month: number) => {
  const data = await bandWidthRepository
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

  const totalIp = await bandWidthRepository
    .createQueryBuilder("bandwidth")
    .select("bandwidth.ip", "ip")
    .addSelect("SUM(bandwidth.runtime)", "runtime")
    .addSelect("SUM(bandwidth.usage)", "usage")
    .where("EXTRACT(year from bandwidth.date) = :year", { year })
    .andWhere("EXTRACT(month from bandwidth.date) = :month", { month })
    .groupBy("bandwidth.ip")
    .orderBy("bandwidth.ip")
    .getRawMany();

  const totalDate = await bandWidthRepository
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

  return { data, totalIp, totalDate, total };
};