function Popup() {
  return (
    <div className="relative p-4 w-[350px] bg-background">

      <div className="">
        {/* <div className="w-full  h-20 overflow-hidden ">
            <img
              className="mx-auto h-20 w-auto"
              src={'icons/icon128.png'}
              width={150}
              height={150}
            />
          </div> */}
        <div className="text-center">
          <h1 className=" font-bold text-3xl text-white">
            🔮 Amazon Scanner
          </h1>
          <p className="text-sm text-muted-foreground">
            Ultra-premium Amazon insights.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Popup;
