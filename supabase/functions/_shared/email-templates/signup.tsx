/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Bekräfta din e-post för {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Bekräfta din e-post</Heading>
        <Text style={text}>
          Tack för att du har skapat konto hos{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          !
        </Text>
        <Text style={text}>
          Bekräfta din e-postadress (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) genom att klicka på knappen nedan:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Bekräfta e-post
        </Button>
        <Text style={footer}>
          Om du inte skapade kontot kan du ignorera mejlet.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }
const container = { padding: '20px 25px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: 'hsl(20 20% 15%)',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: 'hsl(20 10% 50%)',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const link = { color: 'hsl(24 95% 53%)', textDecoration: 'underline' }
const button = {
  backgroundColor: 'hsl(24 95% 53%)',
  color: 'hsl(0 0% 100%)',
  fontSize: '14px',
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: 'hsl(20 10% 50%)', margin: '30px 0 0' }
