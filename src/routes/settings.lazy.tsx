import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsDrawer from '../components/SettingsDrawer'
import { makeStyles, tokens } from '@fluentui/react-components';
import { Field, Radio, RadioGroup } from "@fluentui/react-components";
import { useTheme } from '../components/context/theme-provider';

const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    display: "flex",
    height: "100vh",
    margin: 0,
    padding: 0
  },
  content: {
    flex: "1",
    padding: "16px",
    display: "grid",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  field: {
    display: "flex",
    marginTop: "4px",
    marginLeft: "8px",
    flexDirection: "column",
    gridRowGap: tokens.spacingVerticalS,
  },
});

export const Route = createLazyFileRoute('/settings')({
  component: () => {
    const style = useStyles();
    const { theme, setTheme } = useTheme();

    return (
      <div className={style.root}>
        <SettingsDrawer isOpen />
        <div className="p-6 space-y-5 animate-in slide-in-from-bottom-8 fade-in-60">
          <h1 className="text-3xl font-bold">Appearance</h1>
          <div>
            <h2 className='text-2xl font-semibold'>Theme</h2>
            <div>
              <Field label="Select Theme" className='mt-2'>
                <RadioGroup defaultValue={theme} onChange={(_, data) => {
                  setTheme(data.value as "dark" | "light" | "system")
                }}>
                  <Radio value="system" label="System" />
                  <Radio value="light" label="Light" />
                  <Radio value="dark" label="Dark" />
                </RadioGroup>
              </Field>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
