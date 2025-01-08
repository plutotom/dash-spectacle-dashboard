import chloeThesis from '@/assets/chloeThesis.pdf';
import HaDashboardLayout from '@/Layouts/HaDashboardLayout';

function Thesis() {
    return (
        <>
            <HaDashboardLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Chloe!</h2>}>
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                            <embed src={chloeThesis} type="application/pdf" width="100%" height="800px" />
                        </div>
                    </div>
                </div>
            </HaDashboardLayout>
        </>
    );
}

export default Thesis;
