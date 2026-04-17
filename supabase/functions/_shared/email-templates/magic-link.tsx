/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Din inloggningslänk till Homechef</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Din inloggningslänk</Heading>
        <Text style={text}>
          Klicka på knappen nedan för att logga in på Homechef. Länken är
          giltig under en kort stund.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Logga in
        </Button>
        <Text style={footer}>
          Om du inte begärde denna länk kan du ignorera mejlet.
        </Text>
        <Text style={signature}>Med vänliga hälsningar,<br />Homechef-teamet</Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#1f1410',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#55575d',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const button = {
  backgroundColor: '#f97316',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = { fontSize: '12px', color: '#999999', margin: '32px 0 16px' }
const signature = { fontSize: '13px', color: '#55575d', margin: '8px 0 0' }
