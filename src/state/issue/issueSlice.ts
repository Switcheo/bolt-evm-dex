import { KindedOptions, erc20, infoDefaults } from "@openzeppelin/wizard"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { AppState } from "state"


export interface IssueState {
  opts: Required<KindedOptions['ERC20']>
  code: string
  highlightedCode: string | null
  compiling: boolean
}

const initialState: IssueState = {
  opts: {
    kind: 'ERC20',
    ...erc20.defaults,
    premint: '',
    info: { ...infoDefaults }
  },
  code: '',
  highlightedCode: null,
  compiling: false,
}


export const issueSlice = createSlice({
    name: 'issue',
    initialState,
    reducers: {
        optsSet: (state, action: PayloadAction<Required<KindedOptions['ERC20']>>) => {
            state.opts = action.payload
        },
        codeSet: (state, action: PayloadAction<string>) => {
            state.code = action.payload
        },
        highlightedCodeSet: (state, action: PayloadAction<string | null>) => {
            state.highlightedCode = action.payload
        },
        compilingSet: (state, action: PayloadAction<boolean>) => {
            state.compiling = action.payload
        }
    }
})

export const { optsSet, codeSet, highlightedCodeSet, compilingSet } = issueSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectOpts = (state: AppState) => state.issue.opts
export const selectCode = (state: AppState) => state.issue.code
export const selectHighlightedCode = (state: AppState) => state.issue.highlightedCode
export const selectCompiling = (state: AppState) => state.issue.compiling
// export const selectProcessedFiles = (state: AppState) => state.issue.processedFiles

export default issueSlice.reducer