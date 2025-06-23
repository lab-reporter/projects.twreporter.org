export default function Footer() {
    return (
        <footer className=" py-12 mt-20">
            <div className="max-w-6xl mx-auto px-4">
                {/* 社群連結 */}
                <div className="flex justify-center space-x-8 mb-6">
                    <a
                        href="https://www.facebook.com/twreporter/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C40D23] transition-colors duration-300 no-underline"
                    >
                        Facebook
                    </a>
                    <a
                        href="https://www.instagram.com/twreporter/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C40D23] transition-colors duration-300 no-underline"
                    >
                        Instagram
                    </a>
                    <a
                        href="https://twitter.com/tw_reporter_org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C40D23] transition-colors duration-300 no-underline"
                    >
                        Twitter
                    </a>
                    <a
                        href="https://www.youtube.com/channel/UCpEJ-qBUakklWNQgKkKEzog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C40D23] transition-colors duration-300 no-underline"
                    >
                        YouTube
                    </a>
                    <a
                        href="https://www.linkedin.com/company/the-reporter/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C40D23] transition-colors duration-300 no-underline"
                    >
                        LinkedIn
                    </a>
                </div>

                {/* 版權聲明 */}
                <div className="text-center">
                    <p className="text-gray-500 text-sm">
                        The Reporters 2025 All Right Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
} 