import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../../../../public/LoadingAnimation.json";

const Loading = () => {
  const loadingTexts = [
    "Getting everything ready for you",
    "Setting up your learning path",
    "Hang tight, we're organizing your roadmap",
    "Preparing your personalized experience",
    "Hang tight, we're getting everything setup",
    "Patience is a key to success",
  ];

  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    const randomText =
      loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
    setLoadingText(randomText);
  }, []);

  return (
    <div className="my-auto flex h-full w-full flex-col items-center justify-center">
      <Lottie
        animationData={animationData}
      />
      <p className="mt-4 text-lg font-semibold">{loadingText}</p>
    </div>
  );
};

export default Loading;
