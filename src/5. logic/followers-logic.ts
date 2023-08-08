import {execute} from '../2. utils/dal';

export const followVacation = async (userId:number,vacationId:number) => {

      const sql = `INSERT INTO followers (followerId, following_userId, following_vacationId)
      VALUES(DEFAULT, ?, ?)
      ;`;
      await execute(sql,[userId,vacationId]);
}

export const unFollowVacation = async (userId:number,vacationId:number):Promise<void> => {
      const sql = `DELETE FROM followers WHERE following_userId = ? AND following_vacationId = ?;`;
      await execute(sql,[userId,vacationId]);
}

export const getFollowersByVacation = async (vacationId:number,userId:number) :Promise<number> => {
      const sql = `SELECT EXISTS
      (SELECT * FROM followers WHERE following_vacationId = ? AND following_userId = ?) AS isFollowing;`;

      const ifUserFollowing = await execute<number>(sql,[vacationId,userId]);
      return ifUserFollowing;
}

export const getCountOfFollowers = async (vacationId:number) :Promise<number> => {

      const sql = `SELECT COUNT(followerId) AS followers FROM followers WHERE following_vacationId = ?;`;

      const followersCount = await execute<number>(sql,[vacationId]);
      return followersCount;
}

export const getFollowersAndVacations = async () => {
      const sql = `SELECT COUNT(followerId) AS followers, destination 
      FROM followers JOIN vacation_details 
      ON following_vacationId = vacationId GROUP BY following_vacationId;`;

      const graphData = await execute(sql);
      return graphData;
}

export const getFavoritesVacations = async (userId:number) => {

      const sql = `
      SELECT F.following_userId, V.*
      FROM followers AS F JOIN vacation_details AS V ON following_vacationId = vacationId
      WHERE following_userId = ? GROUP BY vacationId
      ORDER BY V.vacationStart ASC;
      `;
      const favorites = await execute(sql,[userId]);
      return favorites;
}
