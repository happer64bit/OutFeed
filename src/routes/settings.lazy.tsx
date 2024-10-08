import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsDrawer from '../components/SettingsDrawer'
import { Link, makeStyles, tokens } from '@fluentui/react-components';
import { Field, Radio, RadioGroup, Button } from "@fluentui/react-components";
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
          
          {/* Appearance Section */}
          <section id="appearance" className='space-y-4'>
            <h1 className="text-3xl font-bold">Appearance</h1>
            <p className="text-sm opacity-80">
              Customize the appearance of the app by selecting a theme. You can choose between Light, Dark, or System default, which automatically matches your device's theme settings.
            </p>
            <div>
              <h2 className="text-2xl font-semibold">Theme</h2>
              <div>
                <Field label="Select Theme" className="mt-2">
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
          </section>
          
          {/* About Section */}
          <section id="about" className="space-y-4">
            <h1 className="text-3xl font-bold">About</h1>
            <p className="text-sm opacity-80">
              Learn more about the application, its terms of use, and where to download updates. Stay up-to-date by visiting the links provided below.
            </p>

            {/* Update Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Update</h2>
              <p className="text-sm opacity-80">
                Keep your application up to date with the latest version. We regularly release updates to enhance features, fix bugs, and ensure the best user experience.
              </p>
              <div className="flex items-center gap-4">
                <Button href="https://github.com/happer64bit/OutFeed/releases/latest" as="a" target='_blank'>
                  Download the Latest Update Here
                </Button>
              </div>
            </div>

            {/* Terms & Policy Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Terms & Policy</h2>
              <p className="text-sm opacity-80">
                Review the licensing terms and policies that govern the usage of this application. We adhere to the <strong>GNU General Public License v3.0</strong>, which ensures that this software remains free and open source.
              </p>
              <div className="flex items-center gap-4">
                <p>
                  For more information, read our <Link href="https://github.com/happer64bit/OutFeed/blob/main/LICENSE">GNU General Public License v3.0</Link>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  },
})
