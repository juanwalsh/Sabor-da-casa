'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Music2, Volume2, VolumeX } from 'lucide-react';

export default function EventBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background to-muted/30">
      {/* Background decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-64 h-64 bg-[#FF6B35]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#F7C41F]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B35]/20 to-[#F7C41F]/20 border border-[#FF6B35]/30 mb-4">
            <Music2 className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-sm font-medium bg-gradient-to-r from-[#FF6B35] to-[#F7C41F] bg-clip-text text-transparent">
              Próximos Eventos
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            Samba de Mesa no EP Lopes
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Uma noite especial com muito samba, bebidas geladas e boa companhia.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Vídeo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            {/* Frame estilo telefone */}
            <div className="relative w-[260px] sm:w-[300px]">
              <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-[#FF6B35]/40 via-[#F7C41F]/30 to-[#FF2D92]/40 blur-2xl opacity-60" />
              <div className="relative rounded-[2rem] overflow-hidden border-4 border-card shadow-2xl shadow-[#FF6B35]/20 bg-black">
                <video
                  ref={videoRef}
                  src="/videos/samba-de-mesa.mp4"
                  loop
                  muted={muted}
                  playsInline
                  className="w-full aspect-[9/16] object-cover"
                />
                {/* Botão mute */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Badge banda */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#F7C41F]/10 border border-[#FF6B35]/20">
              <span className="text-2xl">🎸</span>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Banda</p>
                <p className="font-bold text-foreground text-lg leading-tight">Sambasom</p>
              </div>
            </div>

            {/* Detalhes */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/15 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data</p>
                  <p className="font-semibold text-foreground">10 de Abril &bull; Sexta-feira</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-[#F7C41F]/15 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#F7C41F]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Horário</p>
                  <p className="font-semibold text-foreground">A partir das 20h</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-[#FF2D92]/15 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#FF2D92]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Local</p>
                  <p className="font-semibold text-foreground">EP Lopes &ndash; Forte do Gelo</p>
                  <p className="text-sm text-muted-foreground">Av. Independência, 09 &bull; Unamar, Cabo Frio&ndash;RJ</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <motion.a
              href="/cardapio"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-[#FF6B35] to-[#FF2D92] shadow-lg shadow-[#FF6B35]/30 hover:shadow-xl hover:shadow-[#FF6B35]/40 transition-shadow"
            >
              🍺 Peça suas bebidas para o evento
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
