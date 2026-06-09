-- ============================================================
-- Kelly Fit — Migración de tablas en Supabase
-- Pega y ejecuta este SQL en: Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Perfil de usuario
CREATE TABLE IF NOT EXISTS kf_perfil (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre       text NOT NULL DEFAULT 'Kelly',
  peso_actual  numeric,
  peso_objetivo numeric,
  estatura     numeric,
  updated_at   timestamptz DEFAULT now()
);

-- 2. Metas nutricionales
CREATE TABLE IF NOT EXISTS kf_meta_nutricional (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  kcal         integer NOT NULL DEFAULT 1950,
  proteina     integer NOT NULL DEFAULT 130,
  grasa        integer NOT NULL DEFAULT 60,
  carbohidrato integer NOT NULL DEFAULT 220,
  updated_at   timestamptz DEFAULT now()
);

-- 3. Sesiones de entrenamiento
CREATE TABLE IF NOT EXISTS kf_sesiones (
  id          text NOT NULL,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha       date NOT NULL,
  dia         text NOT NULL,
  semana      integer NOT NULL,
  completado  boolean NOT NULL DEFAULT false,
  ejercicios  jsonb NOT NULL DEFAULT '[]',
  updated_at  timestamptz DEFAULT now(),
  PRIMARY KEY (id, user_id)
);

-- 4. Registro de comidas
CREATE TABLE IF NOT EXISTS kf_comidas (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha      date NOT NULL DEFAULT CURRENT_DATE,
  tipo       text NOT NULL CHECK (tipo IN ('desayuno','almuerzo','cena','snack')),
  alimento   jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 5. Medidas corporales semanales
CREATE TABLE IF NOT EXISTS kf_medidas (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  semana             integer NOT NULL,
  fecha              date NOT NULL,
  peso               numeric,
  bmi                numeric,
  grasa_pct          numeric,
  peso_graso_kg      numeric,
  masa_musc_esq_pct  numeric,
  masa_musc_esq_kg   numeric,
  musculo_pct        numeric,
  musculo_kg         numeric,
  created_at         timestamptz DEFAULT now(),
  UNIQUE (user_id, semana)
);

-- ============================================================
-- Row Level Security: cada usuaria solo ve sus propios datos
-- ============================================================

ALTER TABLE kf_perfil           ENABLE ROW LEVEL SECURITY;
ALTER TABLE kf_meta_nutricional ENABLE ROW LEVEL SECURITY;
ALTER TABLE kf_sesiones         ENABLE ROW LEVEL SECURITY;
ALTER TABLE kf_comidas          ENABLE ROW LEVEL SECURITY;
ALTER TABLE kf_medidas          ENABLE ROW LEVEL SECURITY;

-- Perfil
CREATE POLICY "kf_perfil_own" ON kf_perfil
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Meta nutricional
CREATE POLICY "kf_meta_own" ON kf_meta_nutricional
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Sesiones
CREATE POLICY "kf_sesiones_own" ON kf_sesiones
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Comidas
CREATE POLICY "kf_comidas_own" ON kf_comidas
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Medidas
CREATE POLICY "kf_medidas_own" ON kf_medidas
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
