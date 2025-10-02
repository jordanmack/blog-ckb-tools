---
# REQUIRED FIELDS
title: "Are Bitcoin, Ethereum, and Nervos Inflationary or Deflationary?"
slug: "bitcoin-ethereum-nervos-inflationary-deflationary"
permalink: /posts/{{ slug }}/
date: 2022-01-17
layout: layouts/post.njk

# STANDARD FIELDS
tags: ["post", "tokenomics", "bitcoin", "ethereum", "nervos"]
author: "Jordan Mack"
id: "tokenomics-comparison"  # Used for image folder: /assets/images/posts/tokenomics-comparison/

# OPTIONAL FIELDS
# pinned: true  # Uncomment to pin post
# updated: 2022-01-17  # Only add when post is actually updated
post-image: "/assets/images/posts/tokenomics-comparison/post-image.jpg"
---

An introduction to the unique tokenomics of three cryptocurrencies.

Bitcoin, Ethereum, and Nervos are three cryptocurrencies that have all been described to be both inflationary and deflationary. Even though the underlying tokenomics are publicly available, debate continues because the complexity of the subject forbids a simple answer.

In this article, we will give a high-level explanation of how the tokenomics of each of these three cryptocurrencies operate and explain how each of them can be considered both inflationary and deflationary in different contexts.

[[toc]]

## Bitcoin - The Original Tokenomic Standard

The tokenomics of Bitcoin were first set into motion with the launch of the mainnet in 2009. Starting with 0 BTC in existence, tokens are created with each block that is mined using PoW until exactly 21 million coins are produced, at which point mining rewards stop completely.

At launch, the mining rewards were 50 BTC per block, with a new block being created approximately every 10 minutes. At this point, inflation was extremely high because new coins were being created rapidly, but so few coins were in existence. Every four years, the amount of BTC created in the block is cut in half, from 50 BTC, to 25 BTC, to 12.5 BTC, etc. This leads to dramatically lower inflation in the long term.

<img src="/assets/images/posts/tokenomics-comparison/bitcoin-supply-schedule.png" alt="Bitcoin supply schedule" style="display: block; margin: 0 auto 16px;">

Once all 21 million coins have been mined, there will be no more created. This means that the currency will effectively be deflationary since no new coins will ever enter circulation, but coins will continue to exit circulation.

There are several ways that coins can fall out of circulation. The private keys for the coins a person holds can be lost, permanently preventing the coins from being moved again. A person can pass away without leaving their private keys to anyone else. Extremely small fractions of coins leftover from normal transactions, known as dust, can be taken out of circulation over time since the transaction fees for spending them are higher than the coins are worth. Over time, all of these factors continuously reduce the supply of available coins.

The mining rewards will continue to be paid until approximately the year 2140 when all 21 million BTC have been mined. However, Bitcoin may effectively be deflationary far before that date. At every halving event, the number of new coins coming into existence gets smaller and smaller. At some point, the number of coins exiting circulation will exceed the number of coins being created through mining. It is difficult to estimate exactly when this will occur, but it is very likely to happen long before 2140.

## Ethereum - An Experimental Path Forward

The tokenomics of Ethereum are more complex compared to Bitcoin and have changed continuously over the years. Ethereum launched in 2015 with a premine of 60 million ETH and mining rewards of 5 ETH per block, with a new block being created approximately every 13-15 seconds, and slightly smaller rewards are paid to "uncle" blocks which are those which that correctly performed the operation, but were slightly too late to get the full reward. The mining rewards have dropped over the years from 5 ETH, to 3 ETH, and then to 2 ETH. However, unlike Bitcoin, the reward decrease is not following any kind of a predefined schedule. The reward is being manually adjusted by the developers utilizing hard forks.

<img src="/assets/images/posts/tokenomics-comparison/ethereum-block-rewards.png" alt="Ethereum block rewards" style="display: block; margin: 0 auto 16px;">

Bitcoin is designed to have a hard cap of exactly 21 million BTC, but Ethereum has no such limit. Ethereum believes that having a hard cap could lead to situations where mining rewards are too low, leaving the network without proper security incentives. For this reason, Ethereum has adopted a policy of "minimum necessary issuance", which results in a projected inflation rate of approximately 4.5% annually by current estimates.

Ethereum adopted the EIP-1559 standard in 2021, which modifies the way transaction fees are calculated and implements partial burning of the fees received. Since the release of EIP-1559, approximately 75% of the fees that would have gone to miners have instead been burned. To date, this has resulted in an issuance reduction of at least 65%.

Under EIP-1559 the higher the transaction fees, the more ETH is burned. When the fees are particularly high, more ETH may be burned in a block than is created in the block reward. The creates a negative net issuance and deflation.

<img src="/assets/images/posts/tokenomics-comparison/ethereum-eip1559-burn.png" alt="Ethereum EIP-1559 burn mechanism" style="display: block; margin: 0 auto 16px;">

However, negative net issuance can only occur when fees are extremely high, during periods of extreme congestion. Even though there have been periods of deflation, the net issuance over any significant period currently remains positive. This means that Ethereum has become less inflationary than previously, but it is currently still inflationary.

<img src="/assets/images/posts/tokenomics-comparison/ethereum-net-issuance.png" alt="Ethereum net issuance" style="display: block; margin: 0 auto 16px;">

The current design specification for Ethereum 2.0 plans to further reduce issuance once the full transition from PoW to PoS is made. At this point, Ethereum could very well enter the realm of being truly deflationary. However, the timelines for Ethereum 2.0 continue to get pushed out further, and design specifications are subject to change. It may still be a while before we see how this plays out in the real world.

## Nervos - An Evolution in Tokenomic Design

Nervos' tokenomic design is based on several aspects of both Bitcoin and Ethereum, but with added incentive alignment for all parties involved. Nervos launched in 2019 with a premine of 33.6 billion CKBytes and has a total supply that is inflationary in order to pay for security, similar to Ethereum. However, Nervos also uses a predefined block reward system that halves every four years and has a built-in inflation shelter that effectively makes the currency deflationary for long-term holders, similar to Bitcoin.

When a new network is first launched, the value of the native token is low. This is expected, and just like Bitcoin and Ethereum, Nervos pays extra subsidies to miners in order to secure the network in the first few years of its existence. Nervos uses a process called Base Issuance to accomplish this.

Base Issuance is very similar to Bitcoin in several ways. Miners are paid a reward in CKBytes for computational resources for securing the network using PoW. Over time, the assets stored on the network will gain value, which increases the value of the CKByte. In turn, this increases the security level and necessitates fewer subsidies. Base Issuance follows a predetermined inflationary schedule, halving the subsidy amount every four years, and eventually terminating when the threshold of 33.6 billion CKBytes is reached.

As Base Issuance decreases over time, some have speculated that the incentive to miners will not provide adequate security if it is only paid with transaction fees in the far future. Miners require long-term incentives that are directly aligned with ensuring the data in Nervos is preserved. Secondary Issuance was created to address both of these issues.

Secondary Issuance creates a consistent 1.344 billion CKBytes every year. These CKBytes are created using inflation, but it does not affect everyone equally. Nervos uses "targeted inflation" which is distributed to miners, Nervos DAO depositors, and the treasury fund based on the utilization of the blockchain state.

Users who store data in the blockchain state are required to pay state rent to the miners responsible for securing the data. Instead of requiring users to make manual payments, targeted inflation is used to pay the miners in a completely automatic and transparent way. State rent is extremely important for the long-term preservation of data because storing and distributing data is a job with continuous costs. A one-time cost in the form of a transaction fee does not make sense long-term, because miners may stop securing the data if costs continue to accrue but there is no longer a reward for doing the job.

Long-term holders can protect themselves from the targeted inflation by locking their unused CKBytes in the Nervos DAO. Users will be paid interest on their CKBytes at a rate that exactly matches the inflation created by Secondary Issuance. The Nervos DAO often gets labeled as a staking system, but in actuality, it is strictly an inflation shelter. Using the Nervos DAO gives a user interest that completely excludes users from the effects of Secondary Issuance.

Any CKBytes that are created from Secondary Issuance but are unused by state rent and the Nervos DAO are currently being burned. However, in the future, these funds can be deposited into a treasury fund with consent from the community. This will help pay for long-term development on the Nervos ecosystem in the future.

Users of the Nervos DAO are protected from the inflationary effects of Secondary Issuance, which means they are only subject to the inflationary effects of Base Issuance, which decreases by 50% every four years. Just like with Bitcoin, the number of coins exiting circulation will eventually exceed the number of coins being created through mining, leading to the same deflationary scenario for all holders.

<img src="/assets/images/posts/tokenomics-comparison/nervos-issuance-model.png" alt="Nervos issuance model" style="display: block; margin: 0 auto 16px;">

## Moving Toward a Sustainable Future

Bitcoin, Ethereum, and Nervos are each taking their own unique approach to tokenomics. However, there is no way to know exactly what the long-term result of each approach will be. Even with meticulous thought and planning, assumptions must be made about how the world will be decades beyond our current reach.

Back in 2009, when Bitcoin was first launched, no one could have predicted how much the industry would change over the next decade. What started out as vague possibilities were slowly shaped by time into innovations which are now changing the world we live in.

We are now witnessing the foundations of tomorrow's technology being built right before our very eyes. This is no longer just our future, but also the future of our children, and our children's children. Their future will be shaped by the technology we build today. This is why it is absolutely essential that these foundations are able to withstand the challenges of today, and remain sustainable for the decades still to come.

<p style="color: #666; font-style: italic; margin-top: 2rem;">Originally published to Wendy's Whitepaper in 2022.</p>
