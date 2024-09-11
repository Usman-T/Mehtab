import { Card } from "@/components/ui/card";
import { ALL_UPCOMING_ROADMAPS, CAST_VOTE, GET_POLLS } from "@/queries";
import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Loading from "../extras/Loading";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import { ClipLoader } from "react-spinners";

const Community = () => {
  const { data: pollsData, loading: pollsLoading } = useQuery(GET_POLLS);
  const { data: roadmapsData, loading: roadmapsLoading } = useQuery(
    ALL_UPCOMING_ROADMAPS,
  );
  const navigate = useNavigate();
  const [castVote, { loading: mutationLoading }] = useMutation(CAST_VOTE); // Correctly handle loading state

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

  const handleSubmitVote = async () => {
    if (!localStorage.getItem("mehtab-user-token")) {
      return toast.error("Must be logged in to vote");
    }

    if (selectedVote !== null) {
      try {
        const { data } = await castVote({
          variables: {
            pollId: pollsData.getAllPolls[0].id,
            optionId: selectedVote,
          },
        });

        console.log(data);

        localStorage.setItem(
          "vote",
          JSON.stringify({ time: Date.now(), id: selectedVote }),
        );
        toast.success("Voted for next roadmap");
        setUserVote(selectedVote);
        setEligibleToVote(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to submit vote. Please try again.");
      }
    } else {
      toast.error("Please select a vote option.");
    }
  };

  if (pollsLoading || roadmapsLoading) {
    return <Loading />;
  }

  const votes = pollsData.getAllPolls[0].votes;
  const roadmaps = roadmapsData.allUpcomingRoadmaps;

  const totalVotes = votes.reduce(
    (sum, vote) => sum + vote.count,
    selectedVote ? 1 : 0,
  );

  return (
    <section className="w-full py-12">
      <div className="container grid gap-8 px-4 md:px-6">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Vote for Upcoming Roadmaps 
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Help shape the future of our platform by voting for the roadmaps  you're most interested in.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {votes.map((vote, id) => {
            const roadmap = roadmaps.find((r) => r.id === vote.optionId);

            const updatedCount =
              vote.optionId === selectedVote ? vote.count + 1 : vote.count;
            const progressValue = Math.floor((updatedCount / totalVotes) * 100);

            return (
              <div
                key={id}
                onClick={() => handleVoteClick(vote.optionId)}
                className={`group relative overflow-hidden rounded-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                  selectedVote === vote.optionId
                    ? "border-green-500 bg-gray-100 shadow-lg"
                    : "border-gray-200"
                }`}
              >
                <div className="relative h-[200px] w-full overflow-hidden">
                  <LazyLoadImage
                    src={
                      roadmap?.image ||
                      "https://www.creativeitinstitute.com/images/course/course_1674371266.jpg"
                    }
                    loading="lazy"
                    onLoad={(e) => (e.target.style.filter = "blur(0px)")}
                    alt="Roadmap"
                    className="h-full w-full object-cover transition-transform group-hover:scale-[1.05] duration-500 ease-in-out"
                    style={{
                      aspectRatio: "300/200",
                      objectFit: "cover",
                      filter: "blur(20px)",
                      transition: "filter 0.5s ease",
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:underline">
                    {roadmap ? roadmap.title : "Unknown Roadmap"}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {progressValue}% voted
                    </span>
                    <Progress value={progressValue} className="h-2 w-1/2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>{" "}
        {eligibleToVote ? (
          <div className="mt-8 flex justify-end">
            <Button
              disabled={mutationLoading}
              onClick={handleSubmitVote}
              className="flex font-semibold"
            >
              <p className="font-semibold">
                {mutationLoading ? "Submitting..." : "Submit"}
              </p>
              {mutationLoading && <ClipLoader color="white" size={16} />}
            </Button>
          </div>
        ) : (
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold">You have already voted.</h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default Community;
