import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html>
				<Head>
					{/* <title>Recipe Admin</title>
					<meta name='viewport' content='initial-scale=1.0, width=device-width' /> */}
					<meta name='description' content='Recipe Admin - Created by Nhilesh Baua' />
					<meta name='author' content='Nhilesh Baua' />
					<meta name='keywords' content='Recipe Admin, React, Next, React JS, Next Js, Bulma, Bulma CSS, React.JS, Next.JS' />
					<meta name='revised' content={new Date()} />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
