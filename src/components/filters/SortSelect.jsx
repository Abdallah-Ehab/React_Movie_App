import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLocale } from '@/context/LocaleContext'

const SORT_OPTIONS = [
  { value: 'popularity.desc', labelKey: 'sort.popularity' },
  { value: 'vote_average.desc', labelKey: 'sort.rating' },
  { value: 'release_date.desc', labelKey: 'sort.releaseDate' },
]

export default function SortSelect({ value, onChange }) {
  const { t } = useLocale()

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder={t('sort.placeholder')} />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {t(opt.labelKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
