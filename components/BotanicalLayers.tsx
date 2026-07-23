import { layer, layerFrameStyle, layerImageStyle, layerSrc } from '@/lib/layers';
import s from './invitation.module.css';

/**
 * Paint order, back to front. The three medallions are deliberately absent — they are
 * rendered by InformationMedallions so the artwork and its Arabic text press together
 * as one object.
 */
const ORDER = [
  'top-left-florals',
  'top-left-leaves',
  'top-right-branch',
  'gold-speckles',
  'emblem',
  'cap',
  'gold-branch',
  'mid-right-cluster',
  'right-sprigs',
  'separator-left',
  'separator-right',
  'arch',
  'portrait',
  'bottom-left-florals',
  'bottom-right-florals',
  'bottom-left-ribbon',
  'bottom-right-ribbon',
] as const;

export default function BotanicalLayers() {
  return (
    <>
      {ORDER.map((id) => {
        const l = layer(id);
        return (
          <div key={id} className={s.layer} data-layer={id} style={layerFrameStyle(l)}>
            <img
              className={s.layerImg}
              src={layerSrc(l)}
              width={l.w}
              height={l.h}
              style={layerImageStyle(l)}
              alt=""
              draggable={false}
            />
          </div>
        );
      })}
    </>
  );
}
