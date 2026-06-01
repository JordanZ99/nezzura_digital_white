import React from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

const steps = [
  {
    num: '01',
    title: 'Nos cuentas tu idea',
    desc: 'Una llamada de 30 minutos. Gratis, sin compromiso. Entendemos tu negocio, tu cliente y tu objetivo.',
    bg: '#ffffff'
  },
  {
    num: '02',
    title: 'Te enviamos una propuesta clara',
    desc: 'Precio fijo, tiempo de entrega definido y exactamente qué vas a recibir. Sin letras pequeñas en un lapso menor a 24 horas.',
    bg: 'hwb(360 100% 5.5%)'
  },
  {
    num: '03',
    title: 'Construimos juntos',
    desc: 'Te mantenemos al tanto en cada paso. Tú apruebas, nosotros ejecutamos.',
    bg: 'hwb(360 100% 11.3%)'
  },
  {
    num: '04',
    title: 'Lanzamos y te acompa\u00f1amos',
    desc: 'El proyecto sale vivo y no desaparecemos. Soporte real de 30 d\u00edas incluido.',
    bg: 'hwb(360 100% 20.1%)'
  }
];

export default function StepsStack() {
  return (
    <section id="scroll-stack-section" style={{
      width: '100%',
      background: '#0a0a0a',
      position: 'relative',
      zIndex: 4
    }}>
      <ScrollStack
        useWindowScroll={true}
        itemDistance={120}
        itemScale={0.03}
        itemStackDistance={40}
        stackPosition="15%"
        baseScale={0.88}
      >
        {steps.map((step, i) => (
          <ScrollStackItem
            key={i}
            style={{ background: step.bg, minHeight: '320px' }}
          >
            <div style={{
              padding: 'clamp(24px, 3vw, 48px)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <p style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(24px, 2vw, 40px)',
                color: '#000000',
                margin: '0 0 12px 0',
                lineHeight: 1,
                textTransform: 'uppercase'
              }}>
                {step.num}
              </p>
              <h3 style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(17px, 1.2vw, 22px)',
                color: '#000000',
                margin: '0 0 10px 0',
                textTransform: 'uppercase'
              }}>
                {step.title}
              </h3>
              <p style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(13px, 0.9vw, 16px)',
                lineHeight: 1.6,
                color: '#000000',
                margin: 0,
                textTransform: 'uppercase'
              }}>
                {step.desc}
              </p>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
