
namespace :data do
  desc "Import race riots"
  task :riots => :environment do
    require 'CSV'

    puts 'LOADING.....'
  	CSV.foreach('Riots.csv', :headers => true) do |row|
      riot = Riot.create!(row.to_hash)
      puts row.to_hash
    end
  end
end
