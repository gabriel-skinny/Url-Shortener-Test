import { Url } from "../Url";

describe("Url entity", () => {
    it("Should create a url entity", () => {
        const url = new Url({
            destinyUrl: "densityUrl.com",
        })

        expect(url).toBeTruthy();
        expect(url.id).toBeTruthy();
    });

    it("Should add the click number of a url", () => {
        const url = new Url({
            destinyUrl: "densityUrl.com",
        });

        url.click();

        expect(url).toBeTruthy();
        expect(url.clickNumber).toBe(1);
    });
})