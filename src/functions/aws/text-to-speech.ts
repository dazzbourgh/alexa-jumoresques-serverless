import * as AWS from 'aws-sdk'

const region: string = process.env.REGION;
const pollyClient = new AWS.Polly({
    region: region
});

export default function textToSpeech(text: string): Promise<Buffer> {
    const params: AWS.Polly.Types.SynthesizeSpeechInput = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: 'Maxim'
    };

    return new Promise<Buffer>((resolve, reject) => {
        pollyClient.synthesizeSpeech(params, (err, data) => {
                if (err) {
                    reject(err);
                } else if (data) {
                    if (data.AudioStream instanceof Buffer) {
                        resolve(data.AudioStream);
                    }
                }
            });
    });
}
