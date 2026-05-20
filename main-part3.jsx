import React from 'react'
import { createRoot } from 'react-dom/client'

import './deck-stage.js'
import {
  Ch3Divider,
  ScenarioIntro,
  Step1ClaudeMd,
  Step2Inventory,
  Step2Channels,
  Example01Figma,
  Example02Reference,
  Example03Screenshot,
  Step3Skill,
  SkillComparison,
  Foolproof,
} from './slides-part3.jsx'

const TOTAL = 11

const mount = (id, el) => {
  const node = document.getElementById(id)
  if (!node) return
  createRoot(node).render(el)
}

mount('s1',  <Ch3Divider          n={1}  total={TOTAL} />)
mount('s2',  <ScenarioIntro       n={2}  total={TOTAL} />)
mount('s3',  <Step1ClaudeMd       n={3}  total={TOTAL} />)
mount('s4',  <Step2Inventory      n={4}  total={TOTAL} />)
mount('s5',  <Step2Channels       n={5}  total={TOTAL} />)
mount('s6',  <Example01Figma      n={6}  total={TOTAL} />)
mount('s7',  <Example02Reference  n={7}  total={TOTAL} />)
mount('s8',  <Example03Screenshot n={8}  total={TOTAL} />)
mount('s9',  <Step3Skill          n={9}  total={TOTAL} />)
mount('s10', <SkillComparison     n={10} total={TOTAL} />)
mount('s11', <Foolproof           n={11} total={TOTAL} />)
