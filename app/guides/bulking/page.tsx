"use client";
import React from "react";
import bulkingImage1Src from "@/public/bulkingImage1.png";
import Image from "next/image";
import { Link as ScrollLink } from "react-scroll";

const Bulking = () => {
  return (
    <div className="max-w-[90vw]">
      <h1 className="heading">How to Get Started at the Gym</h1>
      <h1 className="mt-0.5 text-gray-500">Written by: Pradyun Tandra</h1>
      <h1 className="text-2xl font-semibold mt-4">Table of contents</h1>
      <div className="text-xl font-medium">
        <ScrollLink
          className="mt-2 header-link underline block"
          to="intro"
          smooth={true}>
          Intro
        </ScrollLink>
        <ScrollLink
          className="mt-0.5 header-link underline block"
          to="what-is-bulking"
          smooth={true}>
          What is bulking, and when should you bulk?
        </ScrollLink>
        <ScrollLink
          className="mt-0.5 header-link underline block"
          to="how-to-bulk"
          smooth={true}>
          How to bulk
        </ScrollLink>
        <ScrollLink
          className="mt-0.5 header-link underline block"
          to="what-to-eat"
          smooth={true}>
          What to eat
        </ScrollLink>
        <ScrollLink
          className="mt-0.5 header-link underline block"
          to="what-to-eat-at-tams"
          smooth={true}>
          What to eat at TAMS
        </ScrollLink>
      </div>
      <h1 className="text-2xl font-semibold mt-4" id="intro">
        Intro
      </h1>
      <p className="leading-6">
        Hey Beasts! 👋 <br />
        Prady here, I bulked from 125 to 160 lbs from the start of TAMS to now
        (September 2023), gaining muscle and strength. I wrote this guide to
        teach how you can do the same. I hope this guide is valuable for you!
      </p>
      <h1 className="text-2xl font-semibold mt-4" id="what-is-bulking">
        What is bulking, and when should you bulk?
      </h1>
      <p className="leading-6">
        So what is bulking? Bulking is the process of gaining weight over a
        period of time by eating in a calorie surplus. The goal of bulking is to
        put on muscle and gain strength, ideally while not putting on too much
        fat. <br />
        <br />
        When should you bulk? You should bulk if you want to gain muscle and
        strength and are okay with the sacrifice of gaining some fat
        temporarily.
      </p>
      <h1 className="text-2xl font-semibold mt-4" id="how-to-bulk">
        How to bulk
      </h1>
      <p className="leading-6">
        To bulk, you must eat in a calorie surplus (eat more calories than you
        burn). To find out roughly how many calories you burn, we will use a
        TDEE calculator. Enter your age, weight, height, and activity level (I
        use the heavy exercise option), then press calculate.{" "}
      </p>{" "}
      <Image
        src={bulkingImage1Src}
        alt="TDEE Calculator Screenshot"
        className="w-[30vw] mt-4 mb-1 border border-black rounded-md"
      />
      <p className="text-gray-600 mb-4">Caption: My maintenance calories</p>
      <p className="leading-6">
        After getting your maintenance calories, add 500 to it and you have your
        bulking calories (it would be 3515 in my example). You can add less than
        500 if you don’t want to bulk as aggressively, but add at least 300. We
        will aim to eat this many calories while bulking. You should also aim to
        eat around .8 to 1 gram of protein per lb. of body weight.
        <br />
        <br />
        To track roughly how many calories you are eating, we will use an app
        called MyFitnessPal. Create an account and start tracking your calories
        when you are eating. Unfortunately it’s pretty hard to precisely track
        how many calories you are eating, but you can get a feel for it after
        you have been tracking for a while. <br />
        <br />
        <p>
          Week 1-2: Start tracking your meals and aim to get within 500 calories
          of your goal.
        </p>
        <p>
          Week 3 onwards: Track all of your meals and aim to get within 100
          calories of your goal.
        </p>
        <br />
        You should stop bulking when you are no longer comfortable, but
        ultimately when you stop is up to you. I would recommend bulking for at
        least 3 months, the longer the better. Time spent not bulking when you
        know you can is wasted potential. I had to bulk for about a year to gain
        about 30 lbs, and that’s quite fast.
      </p>
      <h1 className="text-2xl font-semibold mt-4" id="what-to-eat">
        What to eat
      </h1>
      <p className="leading-6">
        When bulking you need to be prioritizing healthy, unprocessed foods. A
        dessert every now and then is ok, but you need to hold yourself
        accountable to what you eat.{" "}
        <span className="underline">
          Eat garbage and you will get garbage results
        </span>
        , this is your warning. Calorie dense options like pasta, bread, rice,
        chicken, nuts, etc. help a lot to get your calories in. If you have a
        blender, you can make high calorie shakes that are quick and easy to
        consume.
      </p>
      <h1 className="text-2xl font-semibold mt-4" id="what-to-eat-at-tams">
        What to eat at TAMS
      </h1>
      <h2 className="mt-2 text-lg font-semibold">Eagle’s Landing</h2>
      <p>
        Rice Bowl (Mexican Line): Rice (tortillas for tacos instead of rice
        bowl), corn, black beans, chicken / turkey / pork, queso (optional){" "}
        <br />
        Burger (Wood Grill) <br />
        Pasta (Italian Line) <br />
      </p>
      <h2 className="mt-2 text-lg font-semibold">Champs</h2>
      <p>
        Burger (Grill): Turkey / Beef <br />
        Rotating Foods: <br />
        Seafood Linguini <br />
        Mashed Potatoes <br />
      </p>
    </div>
  );
};

export default Bulking;
