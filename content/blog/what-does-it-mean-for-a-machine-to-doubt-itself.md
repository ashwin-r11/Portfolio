---
title: "What Does It Mean for a Machine to Doubt Itself?"
excerpt: "Doubt is one of the most human things there is. It's also one of the most useful. This is a research story about teaching that instinct to a robot and why a Mars rover 140 million miles from home makes the stakes feel very real."
date: "2026-05-09"
image: "/48555_e1-PIA26071-2023-09-18-at-1.51-JPLWebsite.jpg"
tags: ["Robotics", "Kalman Filter", "Machine Learning", "NASA", "Edge AI"]
readTime: "10 min read"
featured: false
---


## Introduction

Doubt is one of the most human things there is.

Not paralysis not the kind of doubt that stops you from acting. The useful kind. The quiet voice that says *something feels off* even when you can't immediately explain why. The instinct that makes a surgeon pause mid procedure, a pilot cross check an instrument they've trusted a thousand times before, a navigator slow down when the map and the terrain stop agreeing.

We treat this as intuition. But look closely and it's actually a form of calibration. The brain is constantly comparing what it expects against what it's receiving and when those two things drift apart in a way that doesn't quite make sense, it generates a signal. Not an alarm. Just a whisper: *are you sure?*

Now ask a harder question: **what does it mean for a machine to do the same thing?**

Not to fail. Not to shut down. But to continue operating while quietly, continuously asking itself how much it should trust what it's measuring.

That's the question at the center of my research. And to understand why it matters, we have to go to the one place where the consequences of *not* asking it are most severe: a rover, alone on Mars, threading between boulders at 140 million miles from the nearest human who could catch a mistake.


## The Machine That Cannot Afford to Be Wrong

On June 29, 2023, NASA's Perseverance rover was navigating a dense boulder field on the Martian surface. No human driver. No joystick. No one watching in real time. With the help of its autonomous navigation system, AutoNav, Perseverance threaded through the terrain faster than any rover before it evaluating paths, avoiding obstacles, and making decisions entirely on its own.

AutoNav has set records that still feel surreal: the greatest distance driven without human review 699.9 meters in a single stretch and the greatest single day drive distance of 347.7 meters.

![Perseverance's AutoNav traced path](/48555_e1-PIA26071-2023-09-18-at-1.51-JPLWebsite.jpg)
*Perseverance's AutoNav traced path through a rocky Martian terrain section, captured on Sol 838. The blue and cyan lines show the rover's evaluated candidate routes every one computed autonomously, without a human in the loop. Credit: NASA/JPL Caltech.*

At the heart of all of this the one sensor that tells Perseverance where it is, how fast it's moving, and which way it's tilting   is an IMU: an Inertial Measurement Unit. Northrop Grumman's LN 200S, a soup can sized device housing three fiber optic gyros and three linear accelerometers,is functionally the rover's inner ear.

<div className="flex flex-col md:flex-row items-center gap-8 my-8">
  <div className="w-full md:w-1/2">
    <img src="/699oxy9PsXSrIF_PV2_H8upLJP26i-1N6hj59nIfpg35EIJFt91qzbpSjLm5n1YA8_j5qrhqadXUiyTNR9GWCJ4xHlILnlNlarIYjhE4VfFDveCX5oKyYR3BWUAFDBjzLIsud0CoLr-AMCPNJpe6SdRYyup42MWck6ebiKi3d0E.jpeg" alt="IMU axes and measurements" className="!my-0" />
  </div>
  <div className="w-full md:w-1/2 italic text-muted-foreground">
    An IMU measures three axes of linear acceleration (Aₓ, Aᵧ, A_z) and three axes of angular velocity (ωₓ, ωᵧ, ω_z). Six numbers, a hundred times per second and almost every navigation decision downstream depends on trusting them.
  </div>
</div>

Six numbers. A hundred times per second. Everything the rover believes about its position in the universe flows through this one device.

Which means the question that should follow is obvious and almost nobody asks it.

**How does Perseverance know when to stop trusting that sensor?**

<video controls width="100%">
  <source src="/46266_e-PIA24723-Computer_Simulation_of_Perseverances_First_Autonav_Drive.mp4" type="video/mp4" />
</video>
*NASA's simulation of Perseverance's first AutoNav drive on Mars. Every path decision in this sequence is downstream of the IMU. Credit: NASA/JPL Caltech.*


## The Failure That Doesn't Look Like a Failure

There are two kinds of sensor failures. The first is easy: a full dropout, a voltage spike, a flatline on the readout. Engineering has excellent tools for this. Watchdog timers, redundancy checks, threshold monitors  the whole apparatus of fault detection assumes that failure announces itself.

The second kind doesn't announce itself. It *insinuates*.

A sensor that starts introducing a slow sinusoidal wobble into its readings   staying within the noise floor so the statistics look clean. A sensor that begins bleeding signal from one measurement axis into another, changing the *correlation* between channels without touching their individual distributions. A sensor whose analog to digital converter loses resolution so gradually that no single reading looks wrong, even as precision quietly evaporates.

These aren't dramatic failures. They're **quiet corruptions**   and they share one critical property: they look perfectly fine on every standard diagnostic.

The average reading is still correct. The variance is still normal. All the statistical tests return green.

But something is *off*. The pattern has changed. And the thing responsible for catching that pattern   the mathematical engine at the core of every autonomous navigation system   is constitutionally blind to it.

I started calling these **KF blind degradations**. To understand why the name fits, you have to understand what the Kalman Filter actually does   and where its doubt mechanism stops working.


## The Most Trusted Math in Engineering (And Its Blind Spot)

The Kalman Filter is one of the most elegant pieces of mathematics ever applied to a practical problem. It flew on the Apollo guidance computer. It runs inside the GPS in your phone right now. It is the invisible backbone of virtually every autonomous vehicle, spacecraft, and robot navigating the world today.

Its job is to fuse two sources of information: a *model* of how the world works   physics, inertia, motion dynamics   and *measurements* from sensors. Because both sources are imperfect, the filter blends them, weighting each by how much it trusts it. This trust level is encoded in a parameter called **R**.

Engineers recognized early on that a fixed R was a limitation   what if the sensor's noise changes over time? So they built **Adaptive Kalman Filters**: variants like Sage Husa that watch the filter's own internal residuals, called the *innovation sequence*, and update R on the fly when the data starts looking unusual.

This sounds like exactly the doubt mechanism we need. It isn't.

Here's the subtle failure: every adaptive method   Sage Husa, innovation based estimation, all of them   uses that same innovation sequence as its diagnostic window. And the innovation sequence is only sensitive to changes in the *mean* and *variance* of the sensor output. It is, by design, a second order statistical test.

Which means any degradation that preserves mean and variance is, to the filter, indistinguishable from nominal operation. The sinusoidal wobble, the cross axis bleed, the resolution creep   none of them register. The filter keeps blending at the wrong ratio. It keeps extending trust it should have started withdrawing. And because the math *looks* internally consistent, there's nothing in the standard toolbox that triggers an alarm.

This is the machine that cannot doubt. Not because it isn't trying   but because its entire self diagnostic apparatus is looking at the wrong thing.


## Teaching a Machine to Feel That Something Is Off

The fix I explored starts with a reframe. Instead of trying to make the Kalman Filter's self diagnostic smarter   which keeps us looking at the same innovation window   what if we brought in an observer that has no stake in the estimation game? Something that doesn't care about dynamics or state prediction. Something that has only one job: recognizing what healthy looks like.

That observer is a **convolutional autoencoder**   a neural network trained exclusively on clean, nominal IMU data.

Here's the intuition. Imagine a cardiologist who has spent their career reading ECGs from healthy hearts. They develop a feel   not just for the numbers, but for the *shape* of health. When you hand them a trace from a heart that's subtly off, they feel it before they can name it. The pattern is wrong in a way that doesn't show up in average heart rate or standard deviation, but shows up in the texture of the signal.

That's what the autoencoder learns. Not the mean. Not the variance. The pattern.

When trained on healthy data and then shown a degraded signal, it tries to reconstruct the healthy version   and the *gap* between what it receives and what it expects to reconstruct becomes a signal. I call this **hₜ**: the health score. Near zero when everything is normal. Rising, smoothly and continuously, as the sensor drifts from its healthy signature.

![1D Convolutional Autoencoder Architecture](/architecture.png)
*The 1D Convolutional Autoencoder. A [128×3] window of raw IMU data   1.28 seconds at 100 Hz   is compressed through four encoder stages to a 16 dimensional bottleneck, then reconstructed by a mirrored decoder. The reconstruction error is the health signal. ~60,000 parameters. Trained once on nominal data. Never touched again.*

It's worth noting that NASA's researchers have explored adjacent territory here. A 2024 JPL paper introduced CAIDDA   Curiosity AI Detects Drive Anomalies   an autoencoder trained on Curiosity's IMU and wheel telemetry that catches subtle drive anomalies human operators miss. It's a remarkable system. But it is a post drive, ground side tool: it runs on Earth after data is downloaded, as a monitoring aid between sessions.

The question my work asks is different: can you run this in real time, onboard, and feed the health signal back into the navigation filter *while the rover is still moving?* Can the system's doubt inform its own decisions, continuously, without waiting for a human to review the data?

That's the loop I'm trying to close.


## From Doubt to Decision: The Trust Mapping

Having a health score is the first half of the problem. The second half is harder: how do you translate *something feels off* into a mathematical adjustment the Kalman Filter will actually use?

The filter speaks in covariances. Its trust level R is a matrix, and the only meaningful way to reduce trust in a sensor is to scale R upward   telling the filter to rely more on its physical model and less on the measurement that's now in question.

So I built a **trust mapping**: a function that takes hₜ and produces a scaling factor α, which multiplies the filter's R in real time.

The mathematics of this mapping are stricter than they might appear. The function must be monotonic   more concern from the autoencoder must always produce more scaling, with no exceptions. It must be bounded   the filter should never be told to ignore measurements entirely, because that's its own failure mode. It must be continuous   hard switches create discontinuities that can destabilize a filter. And it must return exactly 1 at baseline   when the health signal is normal, nothing changes. The filter runs exactly as it was designed.

![Trust Mapping Pipeline Diagram](/pipeline_diagram.png)
*The full pipeline. Raw IMU data → sliding window → convolutional autoencoder → health signal hₜ → trust mapping α(hₜ) → Kalman Filter with scaled measurement covariance Rₖ = αₜR₀. The raw measurement also feeds the filter directly. Each block does one job and nothing else.*

The result is a system where doubt is not binary. The filter doesn't flip between "trust" and "don't trust." It adjusts continuously   the way a careful driver eases off the accelerator when the road gets wet, without stopping entirely.

And you can watch it happen in real time:

![System Response Timeline](/health_timeline.png)
*System response to slow, sub noise floor sensor degradation   the kind invisible to innovation based diagnostics. Top: raw reconstruction error per window. Middle: health signal hₜ rising after degradation onset at t=40s. Bottom: trust scaling α(t)   the filter's R matrix being quietly adjusted upward, smoothly, continuously, without a threshold or a hard switch. This is what calibrated machine doubt looks like.*

What the bottom panel shows is something that didn't exist in the standard toolbox before: a continuous, graded, mathematically principled expression of uncertainty about the sensor itself. Not a fault flag. Not a shutdown. Just the filter, quietly adjusting how much it believes.

## What This Looks Like on a $30 Microcontroller

The gap between "this works in theory" and "this works in the world" is where most ideas go to die. So I built hardware.

An Arduino Nano 33 BLE Sense sits on my desk. Its onboard IMU streams 100 readings per second over USB to my laptop. The laptop runs the autoencoder and the Kalman Filter in a live loop. The trust level   that scaling factor α   gets sent back to the Arduino in real time.

The Arduino changes its LED color. Green when the filter trusts the sensor fully. Blue when it's beginning to adjust. Red when it's seriously concerned.

Tap the board. Tilt it. Press on it. The LED shifts. The math reacts. The abstraction becomes something you can hold in your hand and watch respond.

It's a small sandbox. But it's the same fundamental loop   health signal, trust mapping, filter adjustment   that AutoNav needs 140 million miles away, in an environment where there's no USB cable, no laptop, and no one to notice when something quietly goes wrong.


## The Bigger Principle: Modularity as Philosophy

The system I've built is deliberately modular, and that modularity is the point.

The autoencoder doesn't touch the filter's state. The Kalman Filter doesn't know the autoencoder exists. The trust mapping is the only place they communicate   through a single scalar. Each component does exactly one thing, and does it well.

The autoencoder asks: *does this look healthy?*
The trust mapping translates: *here is how much to adjust.*
The Kalman Filter decides: *given that adjustment, what is my best estimate?*

This is how doubt should work in any system   not as a crisis that rewrites everything, but as a quietly updated prior that propagates through the downstream decisions. And the modularity means you don't have to redesign AutoNav from scratch to add this capability. You place an observer upstream. The rest of the pipeline stays intact.

The applications go well beyond Mars. Any system navigating without GPS   a rover on the Moon, a drone mapping a forest, a surgical robot, an underwater vehicle   is running on sensors it cannot physically inspect. The quiet failures are everywhere. What's been missing is a principled mechanism for the machine to express calibrated doubt about them.


## Conclusion

If there is a single answer to the question this essay opened with   *what does it mean for a machine to doubt itself?*   it's this: **it means knowing the difference between a sensor that is wrong and a sensor that looks wrong, and adjusting your trust accordingly, continuously, without stopping.**

Human doubt is a survival mechanism. It evolved because organisms that never questioned their own perceptions didn't last long. The machine equivalent   a system that watches its own inputs for signs that something has shifted, and responds not with an alarm but with a gentle recalibration   is not a luxury. In any environment where sensors cannot be physically checked and ground truth is unavailable, it is a necessity.

The Kalman Filter is a masterpiece of engineering. But it was designed in an era when the failure modes we could imagine were the ones that announced themselves. The quiet failures   the ones that preserve the statistics while corrupting the pattern   are a different class of problem. They require a different class of observer.

That observer exists now. And it fits on a microcontroller.

```markdown
**One line to keep in mind:**  
**_A machine that cannot doubt its sensors will, eventually, trust one that is lying to it._**
```

   

```
#### **Disclaimer**

**TL;DR note:** The introduction and conclusion intentionally compress most of the blog's ideas 
to serve readers who want a high level synthesis.

All core ideas, system architecture, experimental design, and results described in this blog are 
original and stem from the author's own research and implementation. The content reflects a genuine 
research contribution currently under peer review.

This piece is written for a general audience and intentionally omits formal proofs and full 
experimental results, which are available in the accompanying paper. Treat the analogies and 
explanations as approximations designed for accessibility, not formal specification.

Open source code and the full experimental pipeline: github.com/ashwin-r11/sr-mcu
```

- Image credits: NASA/JPL Caltech (Perseverance imagery and AutoNav simulation), Author (architecture diagram, health timeline, pipeline diagram)
