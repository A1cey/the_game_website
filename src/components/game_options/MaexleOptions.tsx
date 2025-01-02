import { Checkbox } from "@nextui-org/checkbox";

const MaexleOptions = () => {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="maexle-pass-on"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Little Max can be passed to next player
      </label>
      <Checkbox color="success" id="maexle-pass-on" />
    </div>
  );
};

export default MaexleOptions;
