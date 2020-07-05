export type FeatureValue = VoiceFeatureValue | ColorFeatureValue | TemperFeatureValue | HabitatFeatureValue | DomesticationFeatureValue;

type VoiceFeatureValue = 'выть' | 'лаять';
type ColorFeatureValue = 'серый' | 'коричневый' | 'чёрный' | 'белый';
type TemperFeatureValue = 'злой' | 'добрый';
type HabitatFeatureValue = 'лес' | 'дом' | 'улица';
type DomesticationFeatureValue = 'дикий' | 'домашний';
