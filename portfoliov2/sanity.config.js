import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { colorInput } from '@sanity/color-input'
import { inlineSvgInput } from '@focus-reactive/sanity-plugin-inline-svg-input'

export default defineConfig({
  name: 'default',
  title: 'portfolio_v2',

  projectId: '7v8ls614',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), colorInput(), inlineSvgInput()],

  schema: {
    types: schemaTypes,
  },
})