import axios from 'axios';
import {Jumoresque, VkResponse} from "../../domain/domain";

const accessToken = process.env.VK_ACCESS_TOKEN;
const version = process.env.VK_API_VERSION;

export default async function fetchJumoresques(domain: string): Promise<Jumoresque[]> {
    const response = await axios.get<VkResponse>(`https://api.vk.com/method/wall.get`
        + `?domain=${domain}`
        + `&access_token=${accessToken}`
        + `&v=${version}`
        + `&count=50`);
    return response.data.response.items.map(item => {
        return {
            text: item.text,
            likes: item.likes.count
        }
    });
}
