import { renderFile } from "pug";
import path from "path";

// TODO: Decide if testing individual views is useful.
//       Use Puppeteer for a full intergration test instead?
let html: string;
it("should render to html", () => {
    const viewPath = path.join(__dirname, "index.pug");
    html = renderFile(viewPath);
    expect(html).toBeTruthy();
});

it("should contain h1 with text 'Grid Server'", async () => {
    expect(html).toContain("<h1>Grid Server</h1>");
});
