import ApplicationUpdater from "./store/modules/application/updater";
import BridgeUpdater from "./store/modules/bridge/updater";
import ListsUpdater from "./store/modules/lists/updater";
import MulticallUpdater from "./store/modules/multicall/updater";
import TransactionUpdater from "./store/modules/transactions/updater";

const Updaters = () => {
  return (
    <>
      <ListsUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      <BridgeUpdater />
    </>
  );
};

export default Updaters;
