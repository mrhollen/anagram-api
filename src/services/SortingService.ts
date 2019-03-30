export class SortingService {
    public selectionSort<T>(array: T[]): T[] {
        for(let i = 0; i < array.length; i++){
            let lowestIndex: number = i;
            for(let j = i; j < array.length; j++){
                if(array[j] < array[lowestIndex]){
                    lowestIndex = j;
                }
            }
            array = this.swap(array, i, lowestIndex);
        }

        return array;
    }

    public quickSort<T>(array: T[]): T[] {
        throw new Error("Method Not Implemented");
    }

    private swap(array: any[], a: number, b: number): any[] {
        let tempItem = array[a];
        array[a] = array[b];
        array[b] = tempItem;
    
        return array;
    }
}