import { createSelector, createSlice } from "@reduxjs/toolkit";
import { ResultState } from "@store/result-status";
import { DefaultRoles, Role } from "@api/community.model";
import { createCommunity, isMemberOfDao } from "@api/registry.api";
import { AutSocial, DefaultSocials } from "@api/social.model";

export interface IntegrateState {
  community: {
    name: string;
    image: string;
    description: string;
    market: number;
    roles: Role[];
    commitment: number;
    contractType: number;
    daoAddr: string;
    daoTwitter: string;
    handleVerified: boolean;
    socials: AutSocial[];
  };
  status: ResultState;
  errorMessage: string;
  loadingMessage: string;
}

const initialState: IntegrateState = {
  community: {
    name: null,
    image: null,
    description: null,
    market: null,
    daoTwitter: null,
    handleVerified: false,
    roles: [
      {
        id: 1,
        roleName: ""
      },
      {
        id: 2,
        roleName: ""
      },
      {
        id: 3,
        roleName: ""
      }
    ],
    socials: DefaultSocials,
    commitment: null,
    contractType: null,
    daoAddr: null
  },
  status: ResultState.Idle,
  errorMessage: null,
  loadingMessage: null
};

export const integrateSlice = createSlice({
  name: "integrate",
  initialState,
  reducers: {
    integrateUpdateCommunity(state: IntegrateState, action) {
      state.community = {
        ...state.community,
        ...action.payload
      };
    },
    integrateUpdateStatus(state, action) {
      state.status = action.payload;
    },
    resetIntegrateState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCommunity.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(createCommunity.fulfilled, (state) => {
        state.status = ResultState.Idle;
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      })
      .addCase(isMemberOfDao.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(isMemberOfDao.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
        state.errorMessage = action.payload
          ? null
          : "You are not a member of this DAO";
      })
      .addCase(isMemberOfDao.rejected, (state, action) => {
        state.status = ResultState.Failed;
        console.log(action, "action");
        state.errorMessage = "You are not a member of this DAO";
      });
  }
});

export const {
  integrateUpdateStatus,
  integrateUpdateCommunity,
  resetIntegrateState
} = integrateSlice.actions;

const roles = (state) => state.integrate.roles;
export const IntegrateStatus = (state: any) =>
  state.integrate.status as ResultState;
export const IntegrateCommunity = (state: any) =>
  state.integrate.community as typeof initialState.community;
export const IntegrateLoadingMessage = (state: any) =>
  state.integrate.loadingMessage as boolean;
export const IntegrateErrorMessage = (state: any) =>
  state.integrate.errorMessage as string;
export const getRoles = createSelector(roles, (x1): Role[] => {
  const [role1, role2, role3] = x1;
  return [
    {
      id: 4,
      roleName: role1?.value
    },
    {
      id: 5,
      roleName: role2?.value
    },
    {
      id: 6,
      roleName: role3?.value
    },
    ...DefaultRoles
  ];
});

export default integrateSlice.reducer;
