import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { proposal } from '../api/_proposal/generatedContent.js'

const sourcePath = new URL('../api/_proposal/source/ProposalCFS.jsx', import.meta.url)
const imagePath = new URL('../api/_proposal/source/image.png', import.meta.url)
const architectureImagePath = new URL('../api/_proposal/source/arch.png', import.meta.url)

test('approved proposal source is byte-for-byte unchanged', async () => {
  const source = await readFile(sourcePath)
  const hash = createHash('sha256').update(source).digest('hex')
  assert.equal(
    hash,
    'f77549220143485cbbe7a0065f20812a608fc3f09c165d2dbac9632b1dbb7156',
  )
  assert.equal(proposal.sourceChecksum, hash)
})

test('protected proposal image is byte-for-byte unchanged', async () => {
  const image = await readFile(imagePath)
  assert.equal(
    createHash('sha256').update(image).digest('hex'),
    '3ddcd2fc7f3809d0049feb132e979a9f9da744d2e041b86a9f49b6366f9154b5',
  )
})

test('protected architecture diagram is byte-for-byte unchanged', async () => {
  const image = await readFile(architectureImagePath)
  assert.equal(
    createHash('sha256').update(image).digest('hex'),
    '70e06e61dfca226857c4324557fa9a1006db4e782257611281e4893a7ee6a26a',
  )
})

test('section order and approved metadata stay pinned', () => {
  assert.deepEqual(
    proposal.sections.map(({ id, navigationLabel, order }) => ({
      id,
      navigationLabel,
      order,
    })),
    [
      { id: 'manual', navigationLabel: 'Current Process: Manual', order: 1 },
      { id: 'automated', navigationLabel: 'Proposed Process: OptiFlow', order: 2 },
      { id: 'prototype', navigationLabel: 'Prototype', order: 3 },
      { id: 'logic', navigationLabel: 'Allocation Logic Flow', order: 4 },
      { id: 'architecture', navigationLabel: 'Architecture Diagram', order: 5 },
    ],
  )
  assert.equal(proposal.proposalVersion, '1.1.0')
  assert.equal(proposal.approvedAt, '2026-07-31')
})

test('generated content and diagram structure match their snapshots', () => {
  assert.equal(
    proposal.contentChecksum,
    'd37690e9cb4c39cfa84a099c592f7a85ac814f1362e6fb0425daf3f9f0139132',
  )
  assert.equal(
    proposal.diagramStructureHash,
    '5ff3a1506c6d942f3aa5525083e25226bab40de5efb5509d8805be845e0d26d6',
  )
  assert.match(proposal.sections[3].html, /Tier 3: Substitute Cascade/)
  assert.match(proposal.sections[3].html, /Brand Uniqueness/)
  assert.match(proposal.sections[4].html, /OptiFlow Architecture Diagram/)
  assert.match(
    proposal.sections[4].html,
    /\/api\/proposals\/asset\?asset=architecture/,
  )
})
