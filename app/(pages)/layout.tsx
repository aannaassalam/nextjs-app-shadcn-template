import LayoutWrapper from '@/components/layout/LayoutWrapper';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <LayoutWrapper>{children}</LayoutWrapper>;
};

export default layout;
