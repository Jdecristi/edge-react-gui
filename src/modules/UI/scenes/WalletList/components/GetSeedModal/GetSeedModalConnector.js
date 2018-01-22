// @flow

import {connect} from 'react-redux'
// eslint-disable-next-line no-duplicate-imports
import GetSeedModal from './GetSeedModal.ui'
// eslint-disable-next-line no-duplicate-imports
import type {
  GetSeedModalDispatchProps,
  GetSeedModalStateProps
} from './GetSeedModal.ui.js'
import type {State, Dispatch, GetState} from '../../../../../ReduxTypes'
import * as Constants from '../../../../../../constants/indexConstants.js'
import {CLOSE_MODAL_VALUE, VISIBLE_MODAL_NAME} from '../WalletOptions/action'
import * as CORE_SELECTORS from '../../../../../Core/selectors.js'
import s from '../../../../../../locales/strings.js'

export const UNLOCK = 'UNLOCK_WALLET_SEED'
export const LOCK = 'LOCK_WALLET_SEED'

const checkCurrentPassword = (password: string) => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)
  const isPassword = await account.checkPassword(password)
  dispatch({ type: isPassword ? UNLOCK : LOCK })
}

const mapStateToProps = (state: any): GetSeedModalStateProps => {
  const wallet = CORE_SELECTORS.getWallet(state, state.ui.scenes.walletList.walletId)
  const walletId = state.ui.scenes.walletList.walletId

  return {
    visibilityBoolean: state.ui.scenes.walletList[VISIBLE_MODAL_NAME(Constants.GET_SEED_VALUE)],
    getSeed: wallet ? wallet.getDisplayPrivateSeed : () => {},
    walletId: walletId,
    privateSeedUnlocked: state.ui.scenes.walletList.privateSeedUnlocked
  }
}

const mapDispatchToProps = (dispatch: Dispatch): GetSeedModalDispatchProps => {
  const close = () => {
    dispatch({ type: CLOSE_MODAL_VALUE(Constants.GET_SEED_VALUE) })
    dispatch(({ type: LOCK }))
  }

  return ({
    onExitButtonFxn: close,
    onNegative: () => dispatch({ type: LOCK }),
    onPositive: (password: string) => dispatch(checkCurrentPassword(password)),
    onDone: close
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(GetSeedModal)
