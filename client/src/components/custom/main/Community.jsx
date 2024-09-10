import { Card } from "@/components/ui/card";
import { ALL_UPCOMING_ROADMAPS, GET_POLLS } from "@/queries";
import { useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Loading from "../extras/Loading";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Community = () => {
  const { data: pollsData, loading: pollsLoading } = useQuery(GET_POLLS);
  const { data: roadmapsData, loading: roadmapsLoading } = useQuery(
    ALL_UPCOMING_ROADMAPS,
  );
  const navigate = useNavigate();

  const [selectedVote, setSelectedVote] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [eligibleToVote, setEligibleToVote] = useState(true);

  useEffect(() => {
    const voteData = JSON.parse(localStorage.getItem("vote"));
    if (voteData) {
      const voteTime = new Date(voteData.time);
      const now = new Date();
      const timeDiff = now - voteTime;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      if (daysDiff <= 7) {
        setUserVote(voteData.id);
        setEligibleToVote(false);
      } else {
        setEligibleToVote(true);
      }
    }
  }, []);

  const handleVoteClick = (voteId) => {
    setSelectedVote(voteId);
  };

  const handleSubmitVote = () => {
    if (!localStorage.getItem("mehtab-user-token")) {
      return toast.error("Must be logged in to vote");
    }

    console.log("reached");
    if (selectedVote !== null) {
      localStorage.setItem(
        "vote",
        JSON.stringify({ time: Date.now(), id: selectedVote }),
      );
      toast.success("Voted for next roadmap");
      setUserVote(selectedVote);
      setEligibleToVote(false);
    } else {
      console.log("No vote selected.");
    }
  };

  if (pollsLoading || roadmapsLoading) {
    return <Loading />;
  }

  const votes = pollsData.getAllPolls[0].votes;
  const roadmaps = roadmapsData.allUpcomingRoadmaps;

  const selectedRoadmap = roadmaps.find((r) => r.id === userVote);

  return (
    <div className="flex h-full flex-col bg-white p-4 md:p-8">
      {eligibleToVote ? (
        <>
          <h1 className="mb-4 text-xl font-bold md:text-3xl">
            Vote for the Next Roadmap
          </h1>
          <div className="w-full">
            <Card className="border-none p-4">
              <p className="mb-6 text-gray-700">
                Cast your vote for the next roadmap. The highest voted one will
                be released next week.
              </p>
              <div className="flex flex-col space-y-8">
                {votes.map((vote, id) => {
                  const roadmap = roadmaps.find((r) => r.id === vote.optionId);

                  return (
                    <div
                      key={id}
                      onClick={() => handleVoteClick(vote.optionId)}
                      className={`flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border transition-all duration-300 md:flex-row ${selectedVote === vote.optionId ? "border-green-500 shadow-md" : "border-red-200"} hover:shadow-lg`}
                    >
                      <div className="relative h-48 overflow-hidden md:h-64 md:w-1/3">
                        <LazyLoadImage
                          src={
                            roadmap?.image ||
                            "https://www.creativeitinstitute.com/images/course/course_1674371266.jpg"
                          }
                          className="h-full w-full transform object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          onLoad={(e) => (e.target.style.filter = "blur(0px)")}
                          style={{
                            filter: "blur(20px)",
                            transition: "filter 0.5s ease",
                          }}
                        />
                      </div>
                      <div
                        className={`flex flex-col justify-between p-4 md:flex-1 md:p-6 ${selectedVote === vote.optionId ? "bg-gray-100" : ""}`}
                      >
                        <p className="mb-4 text-center text-lg font-semibold md:text-left md:text-xl">
                          {roadmap ? roadmap.title : "Unknown Roadmap"}
                        </p>
                        <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:justify-start md:space-x-4 md:space-y-0">
                          <Button
                            className={`w-full px-6 py-2 text-sm font-semibold md:w-auto ${
                              selectedVote === vote.optionId
                                ? "bg-green-500 text-white"
                                : ""
                            }`}
                          >
                            Vote
                          </Button>
                          <Button
                            className="w-full px-6 py-2 text-sm font-semibold md:w-auto"
                            variant="outline"
                            onClick={() =>
                              navigate(`/roadmaps/${vote.optionId}`)
                            }
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
          <div className="mt-8 flex justify-center">
            <Button onClick={handleSubmitVote} className="font-semibold">
              Submit Vote
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="mb-4 text-xl font-bold md:text-3xl">Your Vote</h1>
          <div className="w-full">
            <Card className="border-none p-4">
              <p className="mb-6 text-gray-700">
                You have already voted. Here are the details of your vote.
              </p>
              {selectedRoadmap ? (
                <div className="flex w-full flex-col rounded-lg border border-green-500 shadow-md md:flex-row">
                  <div className="relative h-48 overflow-hidden md:h-64 md:w-1/3">
                    <LazyLoadImage
                      src={
                        selectedRoadmap.image ||
                        "https://www.creativeitinstitute.com/images/course/course_1674371266.jpg"
                      }
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onLoad={(e) => (e.target.style.filter = "blur(0px)")}
                      style={{
                        filter: "blur(20px)",
                        transition: "filter 0.5s ease",
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-between p-4 md:flex-1 md:p-6">
                    <p className="mb-4 text-center text-lg font-semibold md:text-left md:text-xl">
                      {selectedRoadmap.title}
                    </p>
                    <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:justify-start md:space-x-4 md:space-y-0">
                      <Button className="w-full bg-green-500 px-6 py-2 text-sm font-semibold text-white md:w-auto">
                        Your Vote
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-700">
                  Unable to fetch your voted roadmap details.
                </p>
              )}
              <h2 className="mb-4 mt-8 text-xl font-bold md:text-2xl">
                Other Votes
              </h2>
              <div className="flex flex-col space-y-4">
                {votes.map((vote) => {
                  const roadmap = roadmaps.find((r) => r.id === vote.optionId);
                  return (
                    <div
                      key={vote.optionId}
                      className="flex w-full flex-col rounded-lg border border-gray-200 shadow-sm md:flex-row"
                    >
                      <div className="relative h-48 overflow-hidden md:h-64 md:w-1/3">
                        <LazyLoadImage
                          src={
                            roadmap?.image ||
                            "https://www.creativeitinstitute.com/images/course/course_1674371266.jpg"
                          }
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col justify-between p-4 md:flex-1 md:p-6">
                        <p className="mb-4 text-center text-lg font-semibold md:text-left md:text-xl">
                          {roadmap ? roadmap.title : "Unknown Roadmap"}
                        </p>
                        <p className="text-center text-gray-700">
                          Votes: {vote.count}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </>
      )}

      <h2 className="mb-4 mt-8 text-xl font-bold md:text-3xl">
        Previously Voted Roadmaps
      </h2>
    </div>
  );
};

export default Community;
