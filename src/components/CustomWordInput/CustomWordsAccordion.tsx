import { Accordion, Stack } from "@mantine/core";
import WordInputForm, { CustomWordsFormData } from "./CustomWordsForm";
import LoadedWordsBadges, {
  WordBadgeData,
} from "./WordBadges/LoadedWordBadges";
import { IconBook2 } from "@tabler/icons-react";

export default function CustomWordsAccordion({
  badgeData,
  setFormData,
}: {
  badgeData: WordBadgeData;
  setFormData: (value: CustomWordsFormData) => void;
}) {
  const bookIcon = <IconBook2 />;
  const accordionText: string = "Add custom words";

  return (
    <Accordion>
      <Accordion.Item key={accordionText} value={accordionText}>
        <Accordion.Control icon={bookIcon}>{accordionText}</Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <LoadedWordsBadges data={badgeData} />
            <WordInputForm updateCustomWords={setFormData} />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
