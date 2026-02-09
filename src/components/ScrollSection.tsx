import SmoothScroll from '@/components/three/SmoothScroll';
import HorizontalScroll from '@/components/HorizontalScroll';
import TextFill from '@/components/text/TextFill';
import VerticalScroll from '@/components/blocks/VerticalScroll';

export default function ScrollSection() {
  return (
    <SmoothScroll>
      <HorizontalScroll title="WHY CHOOSE ME?">
        <TextFill />
      </HorizontalScroll>
      <VerticalScroll />
    </SmoothScroll>
  );
}
