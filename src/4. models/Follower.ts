class Follower{
      public followerId?:number;
      public following_userId:number;
      public following_vacationId:number;

      public constructor(follower:Follower){
            this.followerId = follower.followerId;
            this.following_userId = follower.following_userId;
            this.following_vacationId = follower.following_vacationId;
      }
}

export default Follower;