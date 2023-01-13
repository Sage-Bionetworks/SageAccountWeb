import React from 'react'
import { SourceAppConfig } from "components/SourceAppConfigs";
import { psychEncodePortalPalette } from 'synapse-react-client/dist/utils/theme/palette/Palettes'
import LogoSvg from '../assets/PsychEncodeLogo.svg'

const logo = <img
  src={LogoSvg}
  alt="Logo"
/>

const description = 'Learn more about the PsychENCODE Consortium’s investigation of genomic influences on neuropsychiatric disease and download large-scale data sets generated by the initiative.'

export const psychEncode:SourceAppConfig = {
    appId: 'psychencode',
    redirectURL: 'https://psychencode.synapse.org/',
    friendlyName: 'PsychENCODE Knowledge Portal',
    logo,
    theme: {
      palette: psychEncodePortalPalette
    },
    description
  }

export const psychEncodeStaging:SourceAppConfig = {
    appId: 'psychencode-staging',
    redirectURL: 'https://staging.psychencode.synapse.org/',
    friendlyName: 'PsychENCODE Knowledge Portal (staging)',
    logo,
    theme: {
      palette: psychEncodePortalPalette
    },
    description
  }