import {Role} from './role';


export const Rules = {
  [Role.User]: {
    static: [
      "business-profile-page:visit",
      "jobpost-page:visit"
    ],
    dynamic: {
      "user-profile-page:edit": ({userId, profileOwnerId}) => {
        if (!userId || !profileOwnerId) return false;
        return userId === profileOwnerId;
      }
    }
  },
  [Role.Business]: {
    static: [
      "user-profile-page:visit"
    ],
    dynamic: {
      "business-profile-page:edit": ({userId, profileOwnerId}) => {
        if (!userId || !profileOwnerId) return false;
        return userId === profileOwnerId;
      },
      "job-post-page:edit": ({userId, jobpostOwnerId}) => {
        if (!userId || !jobpostOwnerId) return false;
        return userId === jobpostOwnerId;
      },
    }
  }
};
