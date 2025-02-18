import type { UserConfig } from "@/types";
import { getConfig } from "./config";
import { MdOrganizer } from "./mdorganizer";

export const generate = async (userConfig: UserConfig): Promise<void> => {
	const mdOrganizer = new MdOrganizer(userConfig);
	await mdOrganizer.generateGeneratedFolder();
	await mdOrganizer.generateAllCategoryTypeFiles();
	await mdOrganizer.generateAllModules();
	await mdOrganizer.generateIndexFiles();
	console.info("All files generated!");
};

export const main = async () => {
	try {
		const config = await getConfig();
		await generate(config);
	} catch (err) {
		console.error(err);
	}
};
